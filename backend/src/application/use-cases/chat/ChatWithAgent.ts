import { ChatStreamHandlers, ILLMService } from "../../ports/ILLMService";
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
    this.assertInput(input);

    const reply = await this.llmService.chat(
      input.message.trim(),
      input.companyId,
    );

    return { reply };
  }

  async executeStream(
    input: ChatWithAgentInput,
    handlers: ChatStreamHandlers,
  ): Promise<void> {
    this.assertInput(input);

    await this.llmService.chatStream(
      input.message.trim(),
      input.companyId,
      handlers,
    );
  }

  private assertInput(input: ChatWithAgentInput): void {
    if (!input.companyId) {
      throw new AppError("companyId é obrigatório", 400);
    }
  }
}
