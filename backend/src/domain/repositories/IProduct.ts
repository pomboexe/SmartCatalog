import { Product } from "../entities/Product";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  companyId: string;
}

export interface IProductRepository {
  createProduct(input: CreateProductInput): Promise<Product>;
  findByName(name: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
}
