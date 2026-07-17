import { apiRequest } from "./api";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "../types";

export function listProducts(token: string) {
  return apiRequest<Product[]>("/products", { token });
}

export function getProductById(token: string, id: string) {
  return apiRequest<Product>(`/products/${id}`, { token });
}

export function createProduct(token: string, input: CreateProductInput) {
  return apiRequest<Product>("/products", {
    method: "POST",
    token,
    body: input,
  });
}

export function updateProduct(
  token: string,
  id: string,
  input: UpdateProductInput,
) {
  return apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    token,
    body: input,
  });
}

export function deleteProduct(token: string, id: string) {
  return apiRequest<void>(`/products/${id}`, {
    method: "DELETE",
    token,
  });
}
