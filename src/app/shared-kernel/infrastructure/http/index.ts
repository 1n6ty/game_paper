import {
  HttpClient,
  RequestOptions,
} from "@/app/shared-kernel/application/ports/HttpClient";
import { getCsrfToken } from "./csrf";

/**
 * Асинхронная обертка над fetch, которая автоматически обрабатывает
 * заголовки (включая CSRF) и базовые ошибки.
 */
const httpRequest = async <T>(
  method: "GET" | "POST",
  url: string,
  options: RequestOptions = {}
): Promise<T> => {
  const { body, authData } = options;

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Добавляем CSRF-токен для POST запросов
  if (method === "POST") {
    const csrfToken = getCsrfToken();

    if (csrfToken) {
      defaultHeaders["X-CSRFToken"] = csrfToken;
    }
  }

  // Добавляем токен авторизации, если он предоставлен
  if (authData) {
    defaultHeaders["Authorization"] = authData;
  }

  const finalHeaders = { ...defaultHeaders, ...options.headers };

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `[HTTP ERROR] Статус: ${response.status}. Ответ: ${errorText}`
    );
  }

  // Для запросов, которые не возвращают тело (статус 204)
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as T;
};

export interface HttpClientConfig {
  baseUrl?: string;
}

/**
 * Фабрика для создания экземпляра HTTP-клиента.
 */
export const createHttpClient = (config: HttpClientConfig = {}): HttpClient => {
  const { baseUrl = "" } = config;

  return {
    get: <T>(url: string, options?: Omit<RequestOptions, "body">) =>
      httpRequest<T>("GET", baseUrl + url, options),

    post: <T>(url: string, options?: RequestOptions) =>
      httpRequest<T>("POST", baseUrl + url, options),
  };
};
