export type Role = "admin" | "user";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  company?: {
    _id: string;
    name: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ChatResponse {
  reply: string;
}

export interface ApiErrorBody {
  error: string;
}
