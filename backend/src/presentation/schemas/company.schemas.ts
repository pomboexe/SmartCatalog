import { z } from "zod";

export const createCompanyBodySchema = z.object({
  name: z.string().trim().min(1, "nome é obrigatório"),
});

export type CreateCompanyBody = z.infer<typeof createCompanyBodySchema>;
