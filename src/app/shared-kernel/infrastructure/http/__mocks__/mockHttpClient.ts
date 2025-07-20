import { HttpClient } from "@/app/shared-kernel/application/ports/HttpClient";

export const mockHttpClient: HttpClient = {
  get: <T>() => "GET" as T,
  post: <T>() => "POST" as T,
};
