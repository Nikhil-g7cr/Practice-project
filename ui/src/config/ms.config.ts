import { environment } from "../environment/environment";

export const msalConfig = {
  auth: {
    clientId: environment.CLIENT_ID,

    authority: environment.AUTHORITY,

    redirectUri: environment.REDIRECT_URL
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email", "User.Read"],
};
