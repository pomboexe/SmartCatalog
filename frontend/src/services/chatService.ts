import { ApiError } from "./api";
import type { ChatResponse } from "../types";
import { apiRequest } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export type ChatStreamHandlers = {
  onDelta: (content: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
};

/** Resposta completa (sem streaming) — mantido como fallback */
export function sendChatMessage(token: string, message: string) {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    token,
    body: { message },
  });
}

/**
 * Consome POST /chat/stream (SSE sobre fetch).
 * Eventos: { type: "delta", content }, { type: "done" }, { type: "error", message }
 */
export async function streamChatMessage(
  token: string,
  message: string,
  handlers: ChatStreamHandlers,
): Promise<void> {
  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    let errorMessage = "Erro na requisição";

    try {
      const data = (await response.json()) as { error?: string };
      if (data?.error) errorMessage = data.error;
    } catch {
      // ignore
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (!response.body) {
    throw new ApiError("Resposta sem corpo para streaming", 502);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const line = part
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.startsWith("data:"));

      if (!line) continue;

      const payload = line.slice("data:".length).trim();
      if (!payload) continue;

      let event: { type: string; content?: string; message?: string };
      try {
        event = JSON.parse(payload) as {
          type: string;
          content?: string;
          message?: string;
        };
      } catch {
        continue;
      }

      if (event.type === "delta" && typeof event.content === "string") {
        handlers.onDelta(event.content);
      } else if (event.type === "done") {
        handlers.onDone?.();
      } else if (event.type === "error") {
        const msg = event.message || "Erro no streaming";
        handlers.onError?.(msg);
        throw new ApiError(msg, 502);
      }
    }
  }

  handlers.onDone?.();
}
