import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./infrastructure/database/mongoose/connection";

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

  app.get("/health", (_req, res) => {
    res.status(200).json({ message: "OK" });
  });

  const PORT = process.env.PORT || 3333;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
