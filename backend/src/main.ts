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
import { createCompanyRoutes } from "./presentation/routes/company.routes";
import { createAuthRoutes } from "./presentation/routes/auth.routes";

dotenv.config();

async function bootstrap() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI não está definido");
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

  app.use("/companies", createCompanyRoutes({ createCompany }));

  app.use("/auth", createAuthRoutes({ register, login }));

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
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});
