import axios from "axios";
import type { ApiErrorBody } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: API_URL,
});

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token } = options;

  try {
    const response = await api.request<T>({
      url: path,
      method,
      data: body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as ApiErrorBody | undefined;
      const message =
        data && typeof data === "object" && "error" in data
          ? data.error
          : "Erro na requisição";

      throw new ApiError(message, error.response?.status ?? 500);
    }

    throw error;
  }
}
