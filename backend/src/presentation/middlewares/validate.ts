import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../../shared/errors/AppError";

export function validateBody<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Dados inválidos";
      next(new AppError(message, 400));
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateParams<T extends z.ZodType>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const message =
        result.error.issues[0]?.message ?? "Parâmetros inválidos";
      next(new AppError(message, 400));
      return;
    }

    req.params = result.data as Request["params"];
    next();
  };
}
