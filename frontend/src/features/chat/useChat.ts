import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import {
  sendChatMessage,
  streamChatMessage,
  type ChatStreamHandlers,
} from "../../services/chatService";

/** Fallback sem streaming */
export function useSendChatMessage() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (message: string) => sendChatMessage(token!, message),
  });
}

/** Streaming SSE — usado pelo ChatWidget */
export function useStreamChatMessage() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: ({
      message,
      handlers,
    }: {
      message: string;
      handlers: ChatStreamHandlers;
    }) => streamChatMessage(token!, message, handlers),
  });
}
