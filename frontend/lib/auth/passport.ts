import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import type { OAuth2 } from "oauth";
import {
  getOAuthConfig,
  SUAP_AUTHORIZATION_URL,
  SUAP_SCOPE,
  SUAP_TOKEN_URL,
  SUAP_USERINFO_URL,
} from "./suap";

type SuapProfile = Record<string, unknown>;

class SuapStrategy extends OAuth2Strategy {
  private readonly oauth: OAuth2;
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
    this.oauth = this._oauth2;
    this.redirectUri = redirectUri;
  }

  buildAuthorizationUrl(state: string) {
    return this.oauth.getAuthorizeUrl({
      response_type: "code",
      redirect_uri: this.redirectUri,
      scope: SUAP_SCOPE,
      state,
    });
  }

  exchangeCode(code: string) {
    return new Promise<string>((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        code,
        {
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        },
        (error, accessToken) => {
          if (error || !accessToken) {
            reject(
              error ?? new Error("OAuth provider returned no access token"),
            );
            return;
          }
          resolve(accessToken);
        },
      );
    });
  }

  loadProfile(accessToken: string) {
    return new Promise<SuapProfile>((resolve, reject) => {
      this.oauth.getProtectedResource(
        SUAP_USERINFO_URL,
        accessToken,
        (error, body) => {
          if (error) {
            reject(error);
            return;
          }
          if (!body) {
            reject(new Error("SUAP returned an empty identity response"));
            return;
          }
          try {
            resolve(JSON.parse(body.toString()) as SuapProfile);
          } catch {
            reject(new Error("SUAP returned an invalid identity response"));
          }
        },
      );
    });
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
