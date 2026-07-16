import { Role } from "../../../domain/enums/Role";
import { ICompanyRepository } from "../../../domain/repositories/ICompanyRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IPasswordHasher } from "../../ports/IPasswordHasher";
import { ITokenService } from "../../ports/ITokenService";
import { AppError } from "../../../shared/errors/AppError";
import { CreateCompanyUseCase } from "../company/CreateCompany";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  companyName: string;
}

export interface RegisterResult {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: Role;
    companyId: string;
  };
  company: {
    _id: string;
    name: string;
  };
}

export class RegisterUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly companyRepo: ICompanyRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterResult> {
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const createCompany = new CreateCompanyUseCase(this.companyRepo);
    const company = await createCompany.execute({ name: input.companyName });

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepo.createUser({
      name: input.name,
      email: input.email,
      passwordHash,
      role: Role.ADMIN,
      companyId: company._id,
    });

    const token = this.tokenService.sign({
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
    });

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      company: {
        _id: company._id,
        name: company.name,
      },
    };
  }
}
