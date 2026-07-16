import { User } from "../../../domain/entities/User";
import {
  CreateUserInput,
  IUserRepository,
} from "../../../domain/repositories/IUserRepository";
import { Role } from "../../../domain/enums/Role";
import { UserModel } from "../schemas/UserSchema";

export class MongooseUserRepository implements IUserRepository {
  async createUser(input: CreateUserInput): Promise<User> {
    const doc = await UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      companyId: input.companyId,
    });

    return this.toDomain(doc);
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.toDomain(doc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(doc: {
    _id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      _id: doc._id,
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role as Role,
      companyId: doc.companyId,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
