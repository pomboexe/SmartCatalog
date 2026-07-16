import { Router } from "express";
import { Role } from "../../domain/enums/Role";
import { CreateProductUseCase } from "../../application/use-cases/product/CreateProduct";
import { ListProductsUseCase } from "../../application/use-cases/product/ListProducts";
import { GetProductByIdUseCase } from "../../application/use-cases/product/GetProductById";
import { UpdateProductUseCase } from "../../application/use-cases/product/UpdateProduct";
import { DeleteProductUseCase } from "../../application/use-cases/product/DeleteProduct";
import { JwtTokenService } from "../../infrastructure/security/JwtTokenService";
import {
  authMiddleware,
  requireRole,
} from "../middlewares/auth";
import { AppError } from "../../shared/errors/AppError";

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

  router.get("/:id", async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const product = await deps.getProductById.execute(
        id,
        req.user!.companyId,
      );
      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  });

  router.post("/", requireRole(Role.ADMIN), async (req, res, next) => {
    try {
      const { name, description, price, category, imageUrl } = req.body;

      if (!name || !description || price == null || !category || !imageUrl) {
        throw new AppError(
          "name, description, price, category e imageUrl são obrigatórios",
          400,
        );
      }

      const product = await deps.createProduct.execute({
        name,
        description,
        price,
        category,
        imageUrl,
        companyId: req.user!.companyId,
      });

      return res.status(201).json(product);
    } catch (error) {
      return next(error);
    }
  });

  router.put("/:id", requireRole(Role.ADMIN), async (req, res, next) => {
    try {
      const id = String(req.params.id);
      const { name, description, price, category, imageUrl } = req.body;

      const product = await deps.updateProduct.execute(
        id,
        req.user!.companyId,
        { name, description, price, category, imageUrl },
      );

      return res.status(200).json(product);
    } catch (error) {
      return next(error);
    }
  });

  
  router.delete("/:id", requireRole(Role.ADMIN), async (req, res, next) => {
    try {
      const id = String(req.params.id);
      await deps.deleteProduct.execute(id, req.user!.companyId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
