import { Role } from "../enums/Role";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
