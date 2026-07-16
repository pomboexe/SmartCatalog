import { Product } from "../../../domain/entities/Product";
import {
  CreateProductInput,
  IProductRepository,
} from "../../../domain/repositories/IProduct";
import { AppError } from "../../../shared/errors/AppError";

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    if (!input.name?.trim()) {
      throw new AppError("name is required", 400);
    }

    if (input.price == null || Number.isNaN(Number(input.price))) {
      throw new AppError("price must be a valid number", 400);
    }

    if (Number(input.price) < 0) {
      throw new AppError("price cannot be negative", 400);
    }

    return this.productRepo.createProduct({
      ...input,
      price: Number(input.price),
    });
  }
}
