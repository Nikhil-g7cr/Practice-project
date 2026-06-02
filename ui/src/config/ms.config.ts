import { environment } from "../environment/environment";

export const msalConfig = {
  auth: {
    clientId: environment.CLIENT_ID,
    authority: environment.AUTHORITY,
    redirectUri: "http://localhost:5000",
    navigateToLoginRequestUrl: false,
  },

  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};