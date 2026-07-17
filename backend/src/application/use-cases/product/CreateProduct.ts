import { Product } from "../../../domain/entities/Product";
import {
  CreateProductInput,
  IProductRepository,
} from "../../../domain/repositories/IProduct";

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    return this.productRepo.createProduct(input);
  }
}
