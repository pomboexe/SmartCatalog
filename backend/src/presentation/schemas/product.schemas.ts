import { z } from "zod";

export const createProductBodySchema = z.object({
  name: z.string().trim().min(1, "nome é obrigatório"),
  description: z.string().trim().min(1, "descrição é obrigatório"),
  price: z.coerce
    .number({ error: "preço deve ser um número válido" })
    .min(0, "Preço não pode ser negativo"),
  category: z.string().trim().min(1, "categoria é obrigatório"),
  imageUrl: z.url("URL da imagem deve ser uma URL válida"),
});

export const updateProductBodySchema = createProductBodySchema.partial();

export const productIdParamsSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
});

export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
