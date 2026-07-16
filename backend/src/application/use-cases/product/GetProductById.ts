import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProduct";
import { AppError } from "../../../shared/errors/AppError";

export class GetProductByIdUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string, companyId: string): Promise<Product> {
    const product = await this.productRepo.findByIdAndCompanyId(id, companyId);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}
