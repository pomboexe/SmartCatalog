import { Router } from "express";
import { RegisterUseCase } from "../../application/use-cases/auth/Register";
import { LoginUseCase } from "../../application/use-cases/auth/Login";
import { validateBody } from "../middlewares/validate";
import {
  loginBodySchema,
  registerBodySchema,
} from "../schemas/auth.schemas";

interface AuthRouteDeps {
  register: RegisterUseCase;
  login: LoginUseCase;
}

export function createAuthRoutes(deps: AuthRouteDeps): Router {
  const router = Router();

  router.post(
    "/register",
    validateBody(registerBodySchema),
    async (req, res, next) => {
      try {
        const result = await deps.register.execute(req.body);
        return res.status(201).json(result);
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    "/login",
    validateBody(loginBodySchema),
    async (req, res, next) => {
      try {
        const result = await deps.login.execute(req.body);
        return res.status(200).json(result);
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
