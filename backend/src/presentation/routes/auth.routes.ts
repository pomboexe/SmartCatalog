import { Router } from "express";
import { AppError } from "../../shared/errors/AppError";
import { RegisterUseCase } from "../../application/use-cases/auth/Register";
import { LoginUseCase } from "../../application/use-cases/auth/Login";

interface AuthRouteDeps {
  register: RegisterUseCase;
  login: LoginUseCase;
}

export function createAuthRoutes(deps: AuthRouteDeps): Router {
  const router = Router();

  router.post("/register", async (req, res, next) => {
    try {
      const { name, email, password, companyName } = req.body;

      if (!name || !email || !password || !companyName) {
        throw new AppError(
          "name, email, password e companyName são obrigatórios",
          400,
        );
      }

      const result = await deps.register.execute({
        name,
        email,
        password,
        companyName,
      });

      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("email e password são obrigatórios", 400);
      }

      const result = await deps.login.execute({ email, password });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
