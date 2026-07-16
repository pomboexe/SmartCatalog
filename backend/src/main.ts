import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./infrastructure/database/mongoose/connection";
import { MongooseCompanyRepository } from "./infrastructure/database/repositories/MongooseCompanyRepo";
import { MongooseUserRepository } from "./infrastructure/database/repositories/MongooseUserRepo";
import { MongooseProductRepository } from "./infrastructure/database/repositories/MongooseProductRepo";
import { CreateCompanyUseCase } from "./application/use-cases/company/CreateCompany";
import { RegisterUseCase } from "./application/use-cases/auth/Register";
import { LoginUseCase } from "./application/use-cases/auth/Login";
import { CreateProductUseCase } from "./application/use-cases/product/CreateProduct";
import { ListProductsUseCase } from "./application/use-cases/product/ListProducts";
import { GetProductByIdUseCase } from "./application/use-cases/product/GetProductById";
import { UpdateProductUseCase } from "./application/use-cases/product/UpdateProduct";
import { DeleteProductUseCase } from "./application/use-cases/product/DeleteProduct";
import { BcryptPasswordHasher } from "./infrastructure/security/BcryptPasswordHasher";
import { JwtTokenService } from "./infrastructure/security/JwtTokenService";
import { createProductRoutes } from "./presentation/routes/products.routes";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import { AppError } from "./shared/errors/AppError";

dotenv.config();

async function bootstrap() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  await connectToDatabase(mongoUri);

  const app = express();

  app.use(cors());
  app.use(express.json());

  const companyRepo = new MongooseCompanyRepository();
  const userRepo = new MongooseUserRepository();
  const productRepo = new MongooseProductRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService();

  const createCompany = new CreateCompanyUseCase(companyRepo);
  const register = new RegisterUseCase(
    userRepo,
    companyRepo,
    passwordHasher,
    tokenService,
  );
  const login = new LoginUseCase(userRepo, passwordHasher, tokenService);

  const createProduct = new CreateProductUseCase(productRepo);
  const listProducts = new ListProductsUseCase(productRepo);
  const getProductById = new GetProductByIdUseCase(productRepo);
  const updateProduct = new UpdateProductUseCase(productRepo);
  const deleteProduct = new DeleteProductUseCase(productRepo);

  app.get("/health", (_req, res) => {
    res.status(200).json({ message: "OK" });
  });

  app.post("/companies", async (req, res, next) => {
    try {
      const company = await createCompany.execute({ name: req.body.name });
      return res.status(201).json(company);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/auth/register", async (req, res, next) => {
    try {
      const { name, email, password, companyName } = req.body;

      if (!name || !email || !password || !companyName) {
        throw new AppError(
          "name, email, password and companyName are required",
          400,
        );
      }

      const result = await register.execute({
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

  app.post("/auth/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("email and password are required", 400);
      }

      const result = await login.execute({ email, password });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  // Rotas de produto: auth + RBAC ficam em products.routes.ts
  app.use(
    "/products",
    createProductRoutes({
      createProduct,
      listProducts,
      getProductById,
      updateProduct,
      deleteProduct,
      tokenService,
    }),
  );

  app.use(errorHandler);

  const PORT = process.env.PORT || 3333;

  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
