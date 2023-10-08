import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { fullUrl } from "./tools";
import { auth } from "./auth";
import { AuthExpiredeError, AuthNotExistError } from "./errors";
import { GoogleError } from "@/types/error";

const GoogleAPIUrl = "https://people.googleapis.com";
const client = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : GoogleAPIUrl,
});
const isDEV = import.meta.env.DEV;

export type CustomConfig = {
  auth?: boolean;
};
const defaultCustomConfig: CustomConfig = {
  auth: true,
};

client.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig & {
      CUSTOM?: CustomConfig;
    },
  ) => {
    const url = fullUrl(config.baseURL, config.url);
    const _authInfo = await auth.get();
    const customConfig = {
      ...defaultCustomConfig,
      ...config.CUSTOM,
    };

    if (customConfig.auth) {
      if (!_authInfo) {
        throw new AuthNotExistError();
      }

      let token = "";
      if (!!_authInfo?.access_token) {
        token = _authInfo.access_token;
      } else {
        throw new AuthNotExistError(); // 其实不会执行到这个逻辑，已经提前报错
      }

      if (url.includes(GoogleAPIUrl) || isDEV) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return config;
  },
);
function isGoogleError(content: any): content is GoogleError {
  return (
    typeof content === "object" &&
    content !== null &&
    "error" in content &&
    typeof content.error.code === "number" &&
    typeof content.error.message === "string"
  );
}
client.interceptors.response.use(
  (value) => {
    return value;
  },
  (e) => {
    if (e instanceof AuthNotExistError) {
      alert("请重新登录");
    }
    if (e instanceof AxiosError && e.name === "AxiosError") {
      const response = e.response?.data;
      if (isGoogleError(response)) {
        // alert(`${response.error.code}: ${response.error.message}`);
      }
      return Promise.reject(e);
    }
  },
);
export default client;
