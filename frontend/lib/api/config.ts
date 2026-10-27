const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

export const API_URL = configuredApiUrl.replace(/\/+$/, "");
