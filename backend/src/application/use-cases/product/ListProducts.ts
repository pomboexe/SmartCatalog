import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProduct";

export class ListProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(companyId: string): Promise<Product[]> {
    return this.productRepo.findAllByCompanyId(companyId);
  }
}
