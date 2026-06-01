export const environment = {
  APP_API_URL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api",
  APPLICATION_ID: 1,
  PUBLIC_KEY: "---------new publick key for encryption---------",
  CLIENT_ID:
    import.meta.env.VITE_MICROSOFT_CLIENT_ID ||
    "69be62e7-f6ff-4d79-8c2b-ddedb216a5dc",
  AUTHORITY:
    import.meta.env.VITE_MICROSOFT_AUTHORITY ||
    "https://login.microsoftonline.com/380a88f6-5447-406c-bebb-2c908f53f0a3",
  REDIRECT_URL:
    import.meta.env.VITE_MICROSOFT_REDIRECT_URL || "http://localhost:5000",
};
