import { Product } from "../../../domain/entities/Product";
import {
  CreateProductInput,
  IProductRepository,
  UpdateProductInput,
} from "../../../domain/repositories/IProduct";
import { ProductModel } from "../schemas/ProductSchema";

export class MongooseProductRepository implements IProductRepository {
  async createProduct(input: CreateProductInput): Promise<Product> {
    const doc = await ProductModel.create(input);
    return this.toDomain(doc);
  }

  async findByIdAndCompanyId(
    id: string,
    companyId: string,
  ): Promise<Product | null> {
    const doc = await ProductModel.findOne({ _id: id, companyId });
    return doc ? this.toDomain(doc) : null;
  }

  async findAllByCompanyId(companyId: string): Promise<Product[]> {
    const docs = await ProductModel.find({ companyId }).sort({ createdAt: -1 });
    return docs.map((doc) => this.toDomain(doc));
  }

  async updateProduct(
    id: string,
    companyId: string,
    data: UpdateProductInput,
  ): Promise<Product | null> {
    const doc = await ProductModel.findOneAndUpdate(
      { _id: id, companyId },
      { $set: data },
      { new: true },
    );

    return doc ? this.toDomain(doc) : null;
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    const result = await ProductModel.deleteOne({ _id: id, companyId });
    return result.deletedCount === 1;
  }

  private toDomain(doc: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return {
      _id: doc._id,
      name: doc.name,
      description: doc.description,
      price: doc.price,
      category: doc.category,
      imageUrl: doc.imageUrl,
      companyId: doc.companyId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
