import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../src/infrastructure/database/mongoose/connection";
import { CompanyModel } from "../src/infrastructure/database/schemas/CompanySchema";
import { UserModel } from "../src/infrastructure/database/schemas/UserSchema";
import { ProductModel } from "../src/infrastructure/database/schemas/ProductSchema";
import { Role } from "../src/domain/enums/Role";

dotenv.config();

const DEFAULT_PASSWORD = "senha123";

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
};

const companyAProducts: SeedProduct[] = [
  {
    name: "Notebook Pro 14",
    description: "Notebook leve com 16GB de RAM e SSD 512GB",
    price: 5499.9,
    category: "Informática",
    imageUrl: "https://placehold.co/600x400?text=Notebook+Pro+14",
  },
  {
    name: "Mouse sem fio Ergo",
    description: "Mouse ergonômico com sensor de alta precisão",
    price: 189.9,
    category: "Periféricos",
    imageUrl: "https://placehold.co/600x400?text=Mouse+Ergo",
  },
  {
    name: "Teclado Mecânico RGB",
    description: "Teclado mecânico com switches blue e iluminação RGB",
    price: 349.9,
    category: "Periféricos",
    imageUrl: "https://placehold.co/600x400?text=Teclado+RGB",
  },
  {
    name: "Monitor 27 4K",
    description: "Monitor IPS 27 polegadas com resolução 4K",
    price: 2199.0,
    category: "Monitores",
    imageUrl: "https://placehold.co/600x400?text=Monitor+27+4K",
  },
  {
    name: "Headset Gamer X",
    description: "Headset com microfone removível e som surround",
    price: 459.9,
    category: "Áudio",
    imageUrl: "https://placehold.co/600x400?text=Headset+Gamer",
  },
  {
    name: "SSD NVMe 1TB",
    description: "SSD NVMe Gen4 com leitura de até 7000MB/s",
    price: 599.0,
    category: "Armazenamento",
    imageUrl: "https://placehold.co/600x400?text=SSD+1TB",
  },
  {
    name: "Webcam Full HD",
    description: "Webcam 1080p com microfone embutido e autofoco",
    price: 279.9,
    category: "Periféricos",
    imageUrl: "https://placehold.co/600x400?text=Webcam+Full+HD",
  },
  {
    name: "Hub USB-C 7 em 1",
    description: "Hub com HDMI, USB 3.0, leitor de cartão e PD",
    price: 229.9,
    category: "Acessórios",
    imageUrl: "https://placehold.co/600x400?text=Hub+USB-C",
  },
  {
    name: "Cadeira Gamer Apex",
    description: "Cadeira ergonômica com apoio lombar e reclinação",
    price: 1299.0,
    category: "Mobiliário",
    imageUrl: "https://placehold.co/600x400?text=Cadeira+Gamer",
  },
  {
    name: "Roteador Wi-Fi 6",
    description: "Roteador dual-band com cobertura para apartamentos",
    price: 499.9,
    category: "Redes",
    imageUrl: "https://placehold.co/600x400?text=Roteador+WiFi+6",
  },
  {
    name: "Carregador GaN 65W",
    description: "Carregador rápido USB-C compacto de 65W",
    price: 189.0,
    category: "Acessórios",
    imageUrl: "https://placehold.co/600x400?text=Carregador+65W",
  },
];

const companyBProducts: SeedProduct[] = [
  {
    name: "Café Especial 250g",
    description: "Grãos torrados artesanalmente, notas de chocolate",
    price: 42.9,
    category: "Bebidas",
    imageUrl: "https://placehold.co/600x400?text=Cafe+Especial",
  },
  {
    name: "Chá Verde Orgânico",
    description: "Blend de chá verde com ervas cítricas",
    price: 29.9,
    category: "Bebidas",
    imageUrl: "https://placehold.co/600x400?text=Cha+Verde",
  },
  {
    name: "Barra de Proteína",
    description: "Barra com 20g de proteína e baixo açúcar",
    price: 12.5,
    category: "Snacks",
    imageUrl: "https://placehold.co/600x400?text=Barra+Proteina",
  },
  {
    name: "Granola Crocante",
    description: "Granola com castanhas e mel, embalagem 400g",
    price: 34.9,
    category: "Alimentos",
    imageUrl: "https://placehold.co/600x400?text=Granola",
  },
  {
    name: "Azeite Extra Virgem",
    description: "Azeite português 500ml, acidez 0.2%",
    price: 59.9,
    category: "Alimentos",
    imageUrl: "https://placehold.co/600x400?text=Azeite",
  },
  {
    name: "Mel Silvestre",
    description: "Mel puro de abelhas, pote de 300g",
    price: 27.9,
    category: "Alimentos",
    imageUrl: "https://placehold.co/600x400?text=Mel+Silvestre",
  },
  {
    name: "Chocolate 70%",
    description: "Chocolate amargo artesanal com cacau 70%",
    price: 18.9,
    category: "Doces",
    imageUrl: "https://placehold.co/600x400?text=Chocolate+70",
  },
  {
    name: "Biscoito Integral",
    description: "Biscoito integral com aveia e sementes",
    price: 15.9,
    category: "Snacks",
    imageUrl: "https://placehold.co/600x400?text=Biscoito+Integral",
  },
  {
    name: "Suco Natural Laranja",
    description: "Suco 100% natural, sem açúcar adicionado, 1L",
    price: 16.9,
    category: "Bebidas",
    imageUrl: "https://placehold.co/600x400?text=Suco+Laranja",
  },
  {
    name: "Pasta de Amendoim",
    description: "Pasta cremosa sem açúcar, pote 500g",
    price: 32.9,
    category: "Alimentos",
    imageUrl: "https://placehold.co/600x400?text=Pasta+Amendoim",
  },
  {
    name: "Mix de Castanhas",
    description: "Mix de castanhas torradas sem sal, 200g",
    price: 39.9,
    category: "Snacks",
    imageUrl: "https://placehold.co/600x400?text=Mix+Castanhas",
  },
  {
    name: "Água de Coco 1L",
    description: "Água de coco natural, embalagem tetra pak",
    price: 11.9,
    category: "Bebidas",
    imageUrl: "https://placehold.co/600x400?text=Agua+de+Coco",
  },
];

async function clearDatabase() {
  await Promise.all([
    ProductModel.deleteMany({}),
    UserModel.deleteMany({}),
    CompanyModel.deleteMany({}),
  ]);
}

async function seedCompany(params: {
  companyName: string;
  admin: { name: string; email: string };
  user: { name: string; email: string };
  products: SeedProduct[];
  passwordHash: string;
}) {
  const company = await CompanyModel.create({ name: params.companyName });

  const [admin, user] = await UserModel.create([
    {
      name: params.admin.name,
      email: params.admin.email,
      passwordHash: params.passwordHash,
      role: Role.ADMIN,
      companyId: company._id,
    },
    {
      name: params.user.name,
      email: params.user.email,
      passwordHash: params.passwordHash,
      role: Role.USER,
      companyId: company._id,
    },
  ]);

  await ProductModel.insertMany(
    params.products.map((product) => ({
      ...product,
      companyId: company._id,
    })),
  );

  return {
    company,
    admin,
    user,
    productCount: params.products.length,
  };
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI não está definido");
  }

  await connectToDatabase(mongoUri);
  await clearDatabase();

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const techCorp = await seedCompany({
    companyName: "TechCorp",
    admin: { name: "Ana Admin", email: "admin@techcorp.com" },
    user: { name: "Carlos User", email: "user@techcorp.com" },
    products: companyAProducts,
    passwordHash,
  });

  const freshMarket = await seedCompany({
    companyName: "FreshMarket",
    admin: { name: "Beatriz Admin", email: "admin@freshmarket.com" },
    user: { name: "Diego User", email: "user@freshmarket.com" },
    products: companyBProducts,
    passwordHash,
  });

  console.log("\nSeed concluído com sucesso!\n");
  console.log("Senha padrão de todos os usuários:", DEFAULT_PASSWORD);
  console.log("\n--- TechCorp ---");
  console.log(`Empresa: ${techCorp.company.name} (${techCorp.company._id})`);
  console.log(`Admin: ${techCorp.admin.email}`);
  console.log(`User:  ${techCorp.user.email}`);
  console.log(`Produtos: ${techCorp.productCount}`);
  console.log("\n--- FreshMarket ---");
  console.log(
    `Empresa: ${freshMarket.company.name} (${freshMarket.company._id})`,
  );
  console.log(`Admin: ${freshMarket.admin.email}`);
  console.log(`User:  ${freshMarket.user.email}`);
  console.log(`Produtos: ${freshMarket.productCount}`);
  console.log("");
}

seed()
  .catch((error) => {
    console.error("Falha no seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const mongoose = await import("mongoose");
    await mongoose.default.disconnect();
  });
