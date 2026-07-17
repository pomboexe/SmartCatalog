import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().trim().min(1, "nome é obrigatório"),
  email: z.email("email inválido"),
  password: z.string().min(6, "senha deve ter no mínimo 6 caracteres"),
  companyName: z.string().trim().min(1, "nome da empresa é obrigatório"),
});

export const loginBodySchema = z.object({
  email: z.email("email inválido"),
  password: z.string().min(1, "senha é obrigatório"),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
