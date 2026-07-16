import { IProductRepository } from "../../../domain/repositories/IProduct";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(id: string, companyId: string): Promise<void> {
    const deleted = await this.productRepo.deleteProduct(id, companyId);

    if (!deleted) {
      throw new AppError("Produto não encontrado", 404);
    }
  }
}
