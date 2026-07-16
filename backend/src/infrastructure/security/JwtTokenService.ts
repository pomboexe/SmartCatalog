import jwt from "jsonwebtoken";
import {
  ITokenService,
  TokenPayload,
} from "../../application/ports/ITokenService";
import { Role } from "../../domain/enums/Role";
import { AppError } from "../../shared/errors/AppError";

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    this.secret = secret;
    this.expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  sign(payload: TokenPayload): string {
    return jwt.sign(
      {
        sub: payload.userId,
        companyId: payload.companyId,
        role: payload.role,
      },
      this.secret,
      { expiresIn: this.expiresIn as jwt.SignOptions["expiresIn"] },
    );
  }

  verify(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as {
        sub: string;
        companyId: string;
        role: Role;
      };

      return {
        userId: decoded.sub,
        companyId: decoded.companyId,
        role: decoded.role,
      };
    } catch {
      throw new AppError("Invalid or expired token", 401);
    }
  }
}
