import { Product } from "../entities/Product";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  companyId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
}

export interface IProductRepository {
  createProduct(input: CreateProductInput): Promise<Product>;
  findByIdAndCompanyId(
    id: string,
    companyId: string,
  ): Promise<Product | null>;
  findAllByCompanyId(companyId: string): Promise<Product[]>;
  updateProduct(
    id: string,
    companyId: string,
    data: UpdateProductInput,
  ): Promise<Product | null>;
  deleteProduct(id: string, companyId: string): Promise<boolean>;
}
