import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { sendChatMessage } from "../../services/chatService";

export function useSendChatMessage() {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (message: string) => sendChatMessage(token!, message),
  });
}
