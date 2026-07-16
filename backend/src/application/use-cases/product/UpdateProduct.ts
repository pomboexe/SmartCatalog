import { Product } from "../../../domain/entities/Product";
import {
  IProductRepository,
  UpdateProductInput,
} from "../../../domain/repositories/IProduct";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(
    id: string,
    companyId: string,
    data: UpdateProductInput,
  ): Promise<Product> {
    if (data.price != null) {
      if (Number.isNaN(Number(data.price))) {
        throw new AppError("price deve ser um número válido", 400);
      }

      if (Number(data.price) < 0) {
        throw new AppError("price não pode ser negativo", 400);
      }

      data = { ...data, price: Number(data.price) };
    }

    const product = await this.productRepo.updateProduct(id, companyId, data);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  }
}
