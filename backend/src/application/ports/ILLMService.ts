export interface ILLMService {
  chat(message: string, companyId: string): Promise<string>;
}
