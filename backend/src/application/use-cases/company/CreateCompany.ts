import { AppError } from "../../../shared/errors/AppError";
import { Company } from "../../../domain/entities/Company";
import {
  CreateCompanyInput,
  ICompanyRepository,
} from "../../../domain/repositories/ICompanyRepository";

export class CreateCompanyUseCase {
  constructor(private readonly companyRepo: ICompanyRepository) {}

  async execute(input: CreateCompanyInput): Promise<Company> {
    const company = await this.companyRepo.findByName(input.name);
    if (company) {
      throw new AppError("Empresa já existe", 409);
    }

    return this.companyRepo.createCompany(input);
  }
}
