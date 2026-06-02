export const environment = {
  APP_API_URL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api",
  APPLICATION_ID: 1,
  PUBLIC_KEY: "---------new publick key for encryption---------",
  CLIENT_ID: import.meta.env.VITE_MICROSOFT_CLIENT_ID ,
  AUTHORITY: import.meta.env.VITE_MICROSOFT_AUTHORITY ,  
  REDIRECT_URL: import.meta.env.VITE_MICROSOFT_REDIRECT_URL,
};
