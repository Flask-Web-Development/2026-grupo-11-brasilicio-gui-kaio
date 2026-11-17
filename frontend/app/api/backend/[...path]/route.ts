import { getSession } from "@/lib/auth/session";
import { fetchBackend } from "@/lib/server/backend";

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function isPublicRequest(path: string, method: string) {
  if (method !== "GET") return false;
  return (
    path === "tags" ||
    path.startsWith("tags/") ||
    path === "posts/public" ||
    path.startsWith("posts/public/")
  );
}

async function proxyBackendRequest(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const backendPath = path.map(encodeURIComponent).join("/");
  const method = request.method.toUpperCase();
  const session = await getSession();
  const publicRequest = isPublicRequest(backendPath, method);
  if (!publicRequest && !session?.accessToken) {
    return Response.json({ error: "Authentication required" }, { status: 401 });
  }

  const incomingUrl = new URL(request.url);
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  const accept = request.headers.get("accept");
  if (accept) headers.set("Accept", accept);
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();
  const backendResponse = await fetchBackend(
    `${backendPath}${incomingUrl.search}`,
    {
      method,
      headers,
      body,
      cache: "no-store",
    },
  );
  const responseBody =
    backendResponse.status === 204 || backendResponse.status === 304
      ? null
      : await backendResponse.arrayBuffer();
  const responseHeaders = new Headers();
  const responseContentType = backendResponse.headers.get("content-type");
  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }
  return new Response(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = proxyBackendRequest;
export const POST = proxyBackendRequest;
export const PUT = proxyBackendRequest;
export const PATCH = proxyBackendRequest;
export const DELETE = proxyBackendRequest;
