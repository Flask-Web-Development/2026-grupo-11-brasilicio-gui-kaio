import "server-only";

function getBackendApiUrl() {
  const configuredUrl = process.env.BACKEND_API_URL?.trim();
  if (!configuredUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }
  return configuredUrl.replace(/\/+$/, "");
}

export function getBackendUrl(path: string) {
  const normalizedPath = path.replace(/^\/+/, "");
  return normalizedPath
    ? `${getBackendApiUrl()}/${normalizedPath}`
    : getBackendApiUrl();
}

export function fetchBackend(path: string, init: RequestInit = {}) {
  return fetch(getBackendUrl(path), {
    ...init,
    cache: "no-store",
  });
}
