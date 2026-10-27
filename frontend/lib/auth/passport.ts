import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import {
  getOAuthConfig,
  SUAP_AUTHORIZATION_URL,
  SUAP_SCOPE,
  SUAP_TOKEN_URL,
  SUAP_USERINFO_URL,
} from "./suap";

type SuapProfile = Record<string, unknown>;

class SuapStrategy extends OAuth2Strategy {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;

  constructor() {
    const { clientId, clientSecret, redirectUri } = getOAuthConfig();
    super(
      {
        authorizationURL: SUAP_AUTHORIZATION_URL,
        tokenURL: SUAP_TOKEN_URL,
        clientID: clientId,
        clientSecret,
        callbackURL: redirectUri,
        scope: SUAP_SCOPE.split(" "),
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: Record<string, unknown>,
        done: OAuth2Strategy.VerifyCallback,
      ) => done(null, profile),
    );
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  buildAuthorizationUrl(state: string) {
    const url = new URL(SUAP_AUTHORIZATION_URL);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", this.redirectUri);
    url.searchParams.set("scope", SUAP_SCOPE);
    url.searchParams.set("state", state);
    url.searchParams.set("client_id", this.clientId);
    return url.toString();
  }

  async exchangeCode(code: string) {
    const response = await fetch(SUAP_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
      }),
      cache: "no-store",
    });
    const data = (await response.json().catch(() => null)) as {
      access_token?: unknown;
      access?: unknown;
    } | null;
    const accessToken =
      typeof data?.access_token === "string"
        ? data.access_token
        : typeof data?.access === "string"
          ? data.access
          : null;
    if (!response.ok || !accessToken) {
      throw new Error(
        `SUAP token exchange failed with status ${response.status}`,
      );
    }
    return accessToken;
  }

  async loadProfile(accessToken: string) {
    const response = await fetch(SUAP_USERINFO_URL, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
    const profile = (await response
      .json()
      .catch(() => null)) as SuapProfile | null;
    if (!response.ok || !profile) {
      throw new Error(
        `SUAP profile request failed with status ${response.status}`,
      );
    }
    return profile;
  }
}

let strategy: SuapStrategy | undefined;

export function getSuapStrategy() {
  if (!strategy) {
    strategy = new SuapStrategy();
    passport.use("suap", strategy);
  }
  return strategy;
}
