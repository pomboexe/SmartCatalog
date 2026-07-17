import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { APIError } from "openai";
import {
  IProductRepository,
  SearchProductsFilters,
} from "../../domain/repositories/IProduct";
import { ILLMService } from "../../application/ports/ILLMService";
import { AppError } from "../../shared/errors/AppError";

const SEARCH_PRODUCTS_TOOL: ChatCompletionTool = {
  type: "function",
  function: {
    name: "search_products",
    description:
      "Busca produtos reais no catálogo. Use o nome exato search_products. Para listagens gerais, chame sem query/category. Para ordenar por preço, use sortBy.",
    parameters: {
      type: "object",
      additionalProperties: false,
      properties: {
        query: {
          type: "string",
          description:
            "Termo curto no nome/descrição (1 a 3 palavras). Nunca envie a frase completa do usuário.",
        },
        category: {
          type: "string",
          description:
            "Categoria quando o usuário citar uma categoria específica, busque com base nas existentes",
        },
        maxPrice: {
          type: "number",
          description: "Preço máximo quando o usuário limitar o valor",
        },
        sortBy: {
          type: "string",
          enum: ["price_asc", "price_desc"],
          description:
            "price_asc = mais baratos primeiro; price_desc = mais caros primeiro. Omita se não for pedido.",
        },
      },
    },
  },
};

export class GroqLLMService implements ILLMService {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly maxToolRounds = 5;

  constructor(private readonly productRepo: IProductRepository) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY não está definido");
    }

    this.client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    this.model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  }

  async chat(message: string, companyId: string): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: [
          "Você é um assistente de catálogo de produtos.",
          "Sempre chame search_products antes de responder sobre produtos, preços, categorias, quantidade ou recomendações.",
          "Para perguntas gerais ou listagens, chame sem query/category.",
          "Quando o usuário pedir os mais baratos, use sortBy=price_asc. Quando pedir os mais caros, use sortBy=price_desc.",
          "Use query só com palavras-chave curtas do produto, nunca a frase completa.",
          "Nunca invente produtos. Nunca mencione ferramentas ou nomes de function na resposta.",
          "Responda em português com base só nos dados retornados.",
          "Se a lista vier vazia, diga que não encontrou produtos com esses critérios.",
        ].join(" "),
      },
      { role: "user", content: message },
    ];

    try {
      return await this.runWithTools(messages, companyId);
    } catch (error) {
      if (this.isToolUseFailed(error)) {
        return this.recoverFromFailedToolCall(error, message, companyId);
      }

      if (error instanceof AppError) {
        throw error;
      }

      console.error(error);
      throw new AppError(
        "Não foi possível consultar o assistente agora. Tente novamente.",
        502,
      );
    }
  }

  private async runWithTools(
    messages: ChatCompletionMessageParam[],
    companyId: string,
  ): Promise<string> {
    for (let round = 0; round < this.maxToolRounds; round++) {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        tools: [SEARCH_PRODUCTS_TOOL],
        tool_choice:
          round === 0
            ? { type: "function", function: { name: "search_products" } }
            : "none",
        temperature: 0.2,
      });

      const choice = completion.choices[0]?.message;

      if (!choice) {
        throw new AppError("Resposta vazia do modelo", 502);
      }

      const toolCalls = choice.tool_calls;

      if (!toolCalls?.length) {
        return (
          choice.content?.trim() ||
          "Não consegui gerar uma resposta no momento."
        );
      }

      messages.push({
        role: "assistant",
        content: choice.content,
        tool_calls: toolCalls,
      });

      for (const toolCall of toolCalls) {
        if (toolCall.type !== "function") {
          continue;
        }

        const result = await this.executeTool(
          toolCall.function.name,
          toolCall.function.arguments,
          companyId,
        );

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result,
        });
      }
    }

    throw new AppError("Limite de tool calls excedido", 502);
  }

  private async recoverFromFailedToolCall(
    error: unknown,
    userMessage: string,
    companyId: string,
  ): Promise<string> {
    const filters = this.sanitizeFilters(
      this.parseFailedGenerationFilters(error) ?? {},
    );

    const productsJson = await this.executeTool(
      "search_products",
      JSON.stringify(filters),
      companyId,
    );

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: [
            "Você é um assistente de catálogo de produtos.",
            "Responda em português com base apenas no JSON de produtos abaixo.",
            "Não invente itens. Não mencione ferramentas.",
            "Ordene mentalmente por preço se a pergunta pedir os mais baratos ou os mais caros.",
            "Se a lista estiver vazia, diga que não encontrou.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            `Pergunta do usuário: ${userMessage}`,
            `Produtos encontrados (JSON): ${productsJson}`,
          ].join("\n\n"),
        },
      ],
    });

    return (
      completion.choices[0]?.message.content?.trim() ||
      "Encontrei produtos, mas não consegui montar a resposta."
    );
  }

  private isToolUseFailed(error: unknown): boolean {
    if (!(error instanceof APIError)) return false;
    const code = (error.error as { code?: string } | undefined)?.code;
    return error.status === 400 && code === "tool_use_failed";
  }

  private parseFailedGenerationFilters(
    error: unknown,
  ): SearchProductsFilters | null {
    if (!(error instanceof APIError)) return null;

    const failedGeneration = (
      error.error as { failed_generation?: string } | undefined
    )?.failed_generation;

    if (!failedGeneration) return null;

    const jsonMatch = failedGeneration.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      return this.parseToolArguments(jsonMatch[0]);
    } catch {
      return null;
    }
  }

  private parseToolArguments(rawArguments: string): SearchProductsFilters {
    const parsed = JSON.parse(rawArguments || "{}") as Record<string, unknown>;

    const sortBy =
      parsed.sortBy === "price_asc" || parsed.sortBy === "price_desc"
        ? parsed.sortBy
        : undefined;

    return {
      query: typeof parsed.query === "string" ? parsed.query : undefined,
      category:
        typeof parsed.category === "string" ? parsed.category : undefined,
      maxPrice:
        typeof parsed.maxPrice === "number"
          ? parsed.maxPrice
          : parsed.maxPrice != null
            ? Number(parsed.maxPrice)
            : undefined,
      sortBy,
    };
  }

  /** Descarta query longa demais (frase conversacional), sem listas de palavras. */
  private sanitizeQuery(query?: string): string | undefined {
    if (!query?.trim()) return undefined;

    const words = query.trim().split(/\s+/).filter(Boolean);
    if (words.length > 4) return undefined;

    return query.trim();
  }

  private sanitizeFilters(
    filters: SearchProductsFilters,
  ): SearchProductsFilters {
    return {
      query: this.sanitizeQuery(filters.query),
      category: filters.category?.trim() || undefined,
      maxPrice:
        filters.maxPrice != null && !Number.isNaN(Number(filters.maxPrice))
          ? Number(filters.maxPrice)
          : undefined,
      sortBy: filters.sortBy,
    };
  }

  private async executeTool(
    name: string,
    rawArguments: string,
    companyId: string,
  ): Promise<string> {
    const normalizedName = name.includes("search") ? "search_products" : name;

    if (normalizedName !== "search_products") {
      return JSON.stringify({ error: `Ferramenta desconhecida: ${name}` });
    }

    let filters: SearchProductsFilters = {};

    try {
      // companyId NUNCA vem dos args da LLM — só do JWT
      filters = this.sanitizeFilters(this.parseToolArguments(rawArguments));
    } catch {
      filters = {};
    }

    const products = await this.productRepo.searchByCompanyId(
      companyId,
      filters,
    );

    return JSON.stringify(
      products.map((product) => ({
        id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
      })),
    );
  }
}
