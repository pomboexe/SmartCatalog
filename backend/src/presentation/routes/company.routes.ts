import { Router } from "express";
import { CreateCompanyUseCase } from "../../application/use-cases/company/CreateCompany";
import { validateBody } from "../middlewares/validate";
import { createCompanyBodySchema } from "../schemas/company.schemas";

interface CompanyRouteDeps {
  createCompany: CreateCompanyUseCase;
}

export function createCompanyRoutes(deps: CompanyRouteDeps): Router {
  const router = Router();

  router.post(
    "/",
    validateBody(createCompanyBodySchema),
    async (req, res, next) => {
      try {
        const company = await deps.createCompany.execute(req.body);
        return res.status(201).json(company);
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
