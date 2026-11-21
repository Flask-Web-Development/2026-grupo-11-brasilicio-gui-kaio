export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function getResponseErrorMessage(data: unknown): {
  message: string;
  details?: unknown;
} {
  if (typeof data !== "object" || data === null) {
    return { message: "Erro na requisição" };
  }

  if ("error" in data && typeof data.error === "string") {
    return { message: data.error };
  }

  if ("errors" in data && Array.isArray(data.errors)) {
    const messages = data.errors
      .map((error) => {
        if (
          typeof error === "object" &&
          error !== null &&
          "msg" in error &&
          typeof error.msg === "string"
        ) {
          return error.msg;
        }
        return null;
      })
      .filter((message): message is string => message !== null);

    return {
      message: messages.length > 0 ? messages.join("; ") : "Dados inválidos",
      details: data.errors,
    };
  }

  return { message: "Erro na requisição" };
}

async function readJsonResponse(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 304) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
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
  const response = await fetch(`/api/backend${url}`, responseObject);

  const data = await readJsonResponse(response);

  if (!response.ok) {
    const { message, details } = getResponseErrorMessage(data);
    throw new ApiError(message, response.status, details);
  }

  if (data === null) return undefined as T;
  if (typeof data === "object" && data !== null && "data" in data) {
    return data.data as T;
  }
  return data as T;
}

export async function internalFetch<T = unknown>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  const data = await readJsonResponse(response);
  if (!response.ok) {
    const { message, details } = getResponseErrorMessage(data);
    throw new ApiError(message, response.status, details);
  }
  if (data === null) return undefined as T;
  return data as T;
}
