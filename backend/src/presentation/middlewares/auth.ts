import { Request, Response, NextFunction } from "express";
import { Role } from "../../domain/enums/Role";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { AppError } from "../../shared/errors/AppError";

export interface AuthUser {
  userId: string;
  companyId: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authMiddleware(
  tokenService: JwtTokenService,
): (req: Request, _res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    try {
      const header = req.headers.authorization;

      if (!header?.startsWith("Bearer ")) {
        throw new AppError("Cabeçalho de autorização ausente ou inválido", 401);
      }

      const token = header.slice("Bearer ".length);
      const payload = tokenService.verify(token);

      req.user = {
        userId: payload.userId,
        companyId: payload.companyId,
        role: payload.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireRole(
  ...roles: Role[]
): (req: Request, _res: Response, next: NextFunction) => void {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError("Não autorizado", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Acesso negado", 403));
    }

    next();
  };
}
