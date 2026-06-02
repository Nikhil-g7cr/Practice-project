import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./containers/App/App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./config/ms.config.ts";
import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  </Provider>,
);
