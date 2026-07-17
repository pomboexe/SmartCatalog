import { z } from "zod";

export const chatBodySchema = z.object({
  message: z.string().trim().min(1, "mensagem é obrigatório"),
});

export type ChatBody = z.infer<typeof chatBodySchema>;
