import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthContext";
import { queryKeys } from "../../lib/queryKeys";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../../services/productService";
import type { CreateProductInput, UpdateProductInput } from "../../types";

export function useProducts() {
  const { token } = useAuth();

  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => listProducts(token!),
    enabled: Boolean(token),
  });
}

export function useCreateProduct() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(token!, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useUpdateProduct() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateProductInput;
    }) => updateProduct(token!, id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

export function useDeleteProduct() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(token!, id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
