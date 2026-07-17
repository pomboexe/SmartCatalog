export type ChatStreamHandlers = {
  onToken: (token: string) => void | Promise<void>;
};

export interface ILLMService {
  chat(message: string, companyId: string): Promise<string>;
  chatStream(
    message: string,
    companyId: string,
    handlers: ChatStreamHandlers,
  ): Promise<void>;
}
