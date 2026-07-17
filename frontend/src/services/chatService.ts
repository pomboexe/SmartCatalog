import { apiRequest } from "./api";
import type { ChatResponse } from "../types";

export function sendChatMessage(token: string, message: string) {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    token,
    body: { message },
  });
}
