import { Company } from "../entities/Company";

export interface CreateCompanyInput {
  name: string;
}

export interface ICompanyRepository {
  createCompany(input: CreateCompanyInput): Promise<Company>;
  findByName(name: string): Promise<Company | null>;
  findById(id: string): Promise<Company | null>;
}
