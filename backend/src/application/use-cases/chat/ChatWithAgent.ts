import { ILLMService } from "../../ports/ILLMService";
import { AppError } from "../../../shared/errors/AppError";

export interface ChatWithAgentInput {
  message: string;
  companyId: string;
}

export interface ChatWithAgentResult {
  reply: string;
}

export class ChatWithAgentUseCase {
  constructor(private readonly llmService: ILLMService) {}

  async execute(input: ChatWithAgentInput): Promise<ChatWithAgentResult> {
    if (!input.message?.trim()) {
      throw new AppError("message é obrigatório", 400);
    }

    if (!input.companyId) {
      throw new AppError("companyId é obrigatório", 400);
    }

    const reply = await this.llmService.chat(
      input.message.trim(),
      input.companyId,
    );

    return { reply };
  }
}
