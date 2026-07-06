import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./configs/configureStore";
import { SBAAxiosClient } from "apis/base";
import { SWRConfig } from "swr";
import { ConfigProvider, message } from "antd";
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "configs/authConfig";

export const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize().then(() => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });
});

const fetcher = (url: string) => SBAAxiosClient(url).then((res) => res.data);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

message.config({
  duration: 5,
});

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <SWRConfig
        value={{
          fetcher,
          onError(err, key, config) {
            console.log(err, key, config);
          },
          onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            if (error.status === 404) return;
            if (error.status === 403) return;

            if (retryCount >= 0) return;

            // Retry after 5 seconds.
            setTimeout(() => revalidate({ retryCount }), 5000);
          },
          refreshInterval: 5000,
        }}
      >
        <ConfigProvider
          theme={{
            token: {
              fontFamily: "Roboto",
            },
          }}
        />
        <App pca={msalInstance} />
        {/* <App /> */}
      </SWRConfig>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
