import { User } from "../entities/User";
import { Role } from "../enums/Role";

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  companyId: string;
}

export interface IUserRepository {
  createUser(input: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
