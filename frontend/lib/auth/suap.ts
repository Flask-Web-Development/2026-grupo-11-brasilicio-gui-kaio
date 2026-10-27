export const SUAP_AUTHORIZATION_URL = "https://suap.ifrn.edu.br/o/authorize/";
export const SUAP_TOKEN_URL = "https://suap.ifrn.edu.br/o/token/";
export const SUAP_USERINFO_URL = "https://suap.ifrn.edu.br/api/rh/eu/";
export const SUAP_SCOPE = "identificacao email documentos_pessoais";

export function getOAuthConfig() {
  const clientId = process.env.OAUTH2_CLIENT_ID;
  const clientSecret = process.env.OAUTH2_CLIENT_SECRET;
  const redirectUri = process.env.OAUTH2_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("OAuth environment variables are not configured");
  }

  return { clientId, clientSecret, redirectUri };
}
