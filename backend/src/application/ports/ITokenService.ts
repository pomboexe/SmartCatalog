import { Role } from "../../domain/enums/Role";

export interface TokenPayload {
  userId: string;
  companyId: string;
  role: Role;
}

export interface ITokenService {
  sign(payload: TokenPayload): string;
}
