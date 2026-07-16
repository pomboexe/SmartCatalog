import {
  ICompanyRepository,
  CreateCompanyInput,
} from "../../../domain/repositories/ICompanyRepository";
import { Company } from "../../../domain/entities/Company";
import { CompanyModel } from "../schemas/CompanySchema";

export class MongooseCompanyRepository implements ICompanyRepository {
  async createCompany(input: CreateCompanyInput): Promise<Company> {
    const doc = await CompanyModel.create({ name: input.name });
    return this.toDomain(doc);
  }

  async findByName(name: string): Promise<Company | null> {
    const doc = await CompanyModel.findOne({ name });
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<Company | null> {
    const doc = await CompanyModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(doc: any): Company {
    return {
      _id: doc._id,
      name: doc.name,
    };
  }
}
