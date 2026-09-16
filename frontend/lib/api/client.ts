import { API_URL } from "./config";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const responseObject: object = { ...options, headers };

  const response = await fetch(`${API_URL}${url}`, responseObject);

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok)
    throw new ApiError(data?.error ?? "Erro na requisição", response.status);

  return (data && "data" in data ? data.data : data) as T;
}
