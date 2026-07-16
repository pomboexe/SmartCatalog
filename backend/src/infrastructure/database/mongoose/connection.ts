import mongoose from "mongoose";

export async function connectToDatabase(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("Connected to database");
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados", error);
    throw new Error("Falha ao conectar ao banco de dados");
  }
}
