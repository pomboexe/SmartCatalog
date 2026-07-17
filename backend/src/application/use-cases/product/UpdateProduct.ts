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
    const product = await this.productRepo.updateProduct(id, companyId, data);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return product;
  }
}
