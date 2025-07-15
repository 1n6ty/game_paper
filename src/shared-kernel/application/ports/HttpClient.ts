export interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  authData?: string;
}

export interface HttpClient {
  get: <T>(url: string, options?: Omit<RequestOptions, "body">) => Promise<T>;
  post: <T>(url: string, options?: RequestOptions) => Promise<T>;
}
