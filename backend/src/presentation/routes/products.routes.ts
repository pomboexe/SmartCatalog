import { Router } from "express";
import { Role } from "../../domain/enums/Role";
import { CreateProductUseCase } from "../../application/use-cases/product/CreateProduct";
import { ListProductsUseCase } from "../../application/use-cases/product/ListProducts";
import { GetProductByIdUseCase } from "../../application/use-cases/product/GetProductById";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProduct";
import { DeleteProductUseCase } from "../../application/use-cases/product/DeleteProduct";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import { authMiddleware, requireRole } from "../middlewares/auth";
import { validateBody, validateParams } from "../middlewares/validate";
import {
  createProductBodySchema,
  productIdParamsSchema,
  updateProductBodySchema,
} from "../schemas/product.schemas";

interface ProductRoutesDeps {
  createProduct: CreateProductUseCase;
  listProducts: ListProductsUseCase;
  getProductById: GetProductByIdUseCase;
  updateProduct: UpdateProductUseCase;
  deleteProduct: DeleteProductUseCase;
  tokenService: JwtTokenService;
}

export function createProductRoutes(deps: ProductRoutesDeps): Router {
  const router = Router();
  const authenticate = authMiddleware(deps.tokenService);

  router.use(authenticate);

  router.get("/", async (req, res, next) => {
    try {
      const products = await deps.listProducts.execute(req.user!.companyId);
      return res.status(200).json(products);
    } catch (error) {
      return next(error);
    }
  });

  router.get(
    "/:id",
    validateParams(productIdParamsSchema),
    async (req, res, next) => {
      try {
        const product = await deps.getProductById.execute(
          String(req.params.id),
          req.user!.companyId,
        );
        return res.status(200).json(product);
      } catch (error) {
        return next(error);
      }
    },
  );

  router.post(
    "/",
    requireRole(Role.ADMIN),
    validateBody(createProductBodySchema),
    async (req, res, next) => {
      try {
        const product = await deps.createProduct.execute({
          ...req.body,
          companyId: req.user!.companyId,
        });

        return res.status(201).json(product);
      } catch (error) {
        return next(error);
      }
    },
  );

  router.put(
    "/:id",
    requireRole(Role.ADMIN),
    validateParams(productIdParamsSchema),
    validateBody(updateProductBodySchema),
    async (req, res, next) => {
      try {
        const product = await deps.updateProduct.execute(
          String(req.params.id),
          req.user!.companyId,
          req.body,
        );

        return res.status(200).json(product);
      } catch (error) {
        return next(error);
      }
    },
  );

  router.delete(
    "/:id",
    requireRole(Role.ADMIN),
    validateParams(productIdParamsSchema),
    async (req, res, next) => {
      try {
        await deps.deleteProduct.execute(
          String(req.params.id),
          req.user!.companyId,
        );
        return res.status(204).send();
      } catch (error) {
        return next(error);
      }
    },
  );

  return router;
}
