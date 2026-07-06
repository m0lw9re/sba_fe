import axios from "axios";
import qs from "qs";
import authApi from "./auth";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { handleHardLogout } from "utils/common";
import { msalInstance } from "index";

async function getNewTokens(scopes = ["user.read"]) {
  try {
    // Force a new token refresh
    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: scopes,
      forceRefresh: true,
    });

    return {
      accessToken: tokenResponse.accessToken,
      idToken: tokenResponse.idToken,
    };
  } catch (error) {
    // Silent token acquisition failed, fall back to interactive method
    console.log("Silent token acquisition failed, using interactive method");

    try {
      const interactiveResponse = await msalInstance.acquireTokenPopup({
        scopes: scopes,
      });

      return {
        accessToken: interactiveResponse.accessToken,
        idToken: interactiveResponse.idToken,
      };
    } catch (interactiveError) {
      console.error("Error acquiring tokens:", interactiveError);
      return {
        accessToken: "",
        idToken: "",
      };
    }
  }
}

const getToken = () =>
  localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    ? localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    : "";

const getAuthorizationHeader = () => `Bearer ${getToken()}`;

const request = axios.create({
  baseURL: "http://service4all.vinorsoft.com:18003/api/v1",
  headers: {
    "content-type": "application/json",
    Authorization: getAuthorizationHeader(),
  },
  paramsSerializer: (params) => qs.stringify(params),
});

request.interceptors.request.use(function (config) {
  if (config.headers) {
    config.headers["Authorization"] = getAuthorizationHeader();
  }
  return config;
});

// SBA axios client
const SBAAxiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "content-type": "application/json",
    Authorization: getAuthorizationHeader(),
  },
  timeout: 60000,
  paramsSerializer: (params) => qs.stringify(params),
});

SBAAxiosClient.interceptors.request.use(function (config) {
  if (config.headers) {
    config.headers["Authorization"] = getAuthorizationHeader();
  }
  return config;
});

let isRefreshing = false;
let isMsalRefreshing = false;
let refreshSubscribers: any[] = [];
let msalRefreshSubscribers: any[] = [];

function subscribeTokenRefresh(callback: any) {
  refreshSubscribers.push(callback);
}

function subscribeMsalTokenRefresh(callback: any) {
  msalRefreshSubscribers.push(callback);
}

function onTokenRefreshed(token: any) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function onMsalTokenRefreshed(token: any) {
  msalRefreshSubscribers.forEach((callback) => callback(token));
  msalRefreshSubscribers = [];
}

SBAAxiosClient.interceptors.response.use(
  (response) => response,
  async function (error) {
    if (error.response?.status === 404) {
      return error.response.status;
    }

    const originalRequest = error.config;

    if (error.code === "ERR_BAD_REQUEST" && error.response?.status === 409) {
      handleHardLogout();
    }

    // Handle 403 errors with MSAL token refresh
    if (
      error.code === "ERR_BAD_REQUEST" &&
      error.response?.status === 403 &&
      !originalRequest._retry403
    ) {
      if (!isMsalRefreshing) {
        isMsalRefreshing = true;
        originalRequest._retry403 = true;

        try {
          const newTokens = await getNewTokens();

          if (!newTokens.accessToken || !newTokens.idToken) {
            handleHardLogout();
            return Promise.reject(error);
          }

          // Call backend with new tokens
          const getToken = await authApi.loginWithMsal(
            newTokens.idToken,
            newTokens.accessToken
          );

          if (!getToken?.data?.accessToken) {
            handleHardLogout();
            return Promise.reject(error);
          }

          // Update authorization header with new token
          const backendToken = getToken.data.accessToken;
          localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, backendToken);
          SBAAxiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${backendToken}`;

          // Notify all subscribers about new token
          onMsalTokenRefreshed(backendToken);

          // Retry original request
          originalRequest.headers["Authorization"] = `Bearer ${backendToken}`;
          return axios(originalRequest);
        } catch (msalError) {
          handleHardLogout();
          console.error("MSAL token refresh failed:", msalError);
          return Promise.reject(msalError);
        } finally {
          isMsalRefreshing = false;
        }
      } else {
        // Add request to queue
        return new Promise((resolve) => {
          subscribeMsalTokenRefresh((token: any) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }

    // Handle 401 errors
    if (
      error.code === "ERR_BAD_REQUEST" &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await authApi.refesh();

          if (response.data.code === 200 || response.data.code === 400) {
            // Do nothing
            isRefreshing = false;
            return Promise.reject(error);
          } else if (response.data.code === 403) {
            handleHardLogout();
            return Promise.reject(error);
          } else {
            const newToken = response.data.refreshToken;
            localStorage.setItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN, newToken);
            SBAAxiosClient.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newToken}`;

            // Notify all subscribers about new token
            onTokenRefreshed(newToken);

            // Retry original request
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Add request to queue
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: any) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(axios(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export { request, SBAAxiosClient };
