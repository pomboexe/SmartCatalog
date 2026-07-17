import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
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
      "Busca produtos no catálogo da empresa do usuário autenticado. Use sempre que precisar de dados reais de produtos, preços ou categorias.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Termo de busca no nome ou descrição do produto",
        },
        category: {
          type: "string",
          description: "Filtrar por categoria (ex: Informática, Bebidas)",
        },
        maxPrice: {
          type: "number",
          description: "Preço máximo do produto",
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
          "Você é um assistente de catálogo de produtos de uma plataforma SaaS multi-tenant.",
          "Use a ferramenta search_products para consultar o banco de dados antes de responder sobre produtos.",
          "Responda sempre em português, de forma clara e objetiva.",
          "Baseie-se apenas nos dados retornados pela ferramenta.",
          "Se não houver produtos, diga isso explicitamente.",
          "Não invente produtos, preços ou categorias.",
        ].join(" "),
      },
      { role: "user", content: message },
    ];

    for (let round = 0; round < this.maxToolRounds; round++) {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        tools: [SEARCH_PRODUCTS_TOOL],
        tool_choice: "auto",
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

  private async executeTool(
    name: string,
    rawArguments: string,
    companyId: string,
  ): Promise<string> {
    if (name !== "search_products") {
      return JSON.stringify({ error: `Ferramenta desconhecida: ${name}` });
    }

    let filters: SearchProductsFilters = {};

    try {
      const parsed = JSON.parse(rawArguments || "{}") as Record<
        string,
        unknown
      >;

      // companyId NUNCA vem dos args da LLM — só do JWT
      filters = {
        query: typeof parsed.query === "string" ? parsed.query : undefined,
        category:
          typeof parsed.category === "string" ? parsed.category : undefined,
        maxPrice:
          typeof parsed.maxPrice === "number"
            ? parsed.maxPrice
            : parsed.maxPrice != null
              ? Number(parsed.maxPrice)
              : undefined,
      };
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
