import { Router } from "express";
import { CreateCompanyUseCase } from "../../application/use-cases/company/CreateCompany";
import { AppError } from "../../shared/errors/AppError";

interface CompanyRouteDeps {
  createCompany: CreateCompanyUseCase;
}

export function createCompanyRoutes(deps: CompanyRouteDeps): Router {
  const router = Router();

  router.post("/", async (req, res, next) => {
    try {
      const { name } = req.body;
      if (!name) {
        throw new AppError("name é obrigatório", 400);
      }
      const company = await deps.createCompany.execute({ name });
      return res.status(201).json(company);
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
