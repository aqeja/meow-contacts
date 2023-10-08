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

client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const url = fullUrl(config.baseURL, config.url);
  const _authInfo = auth.get();

  if (!_authInfo) {
    throw new AuthNotExistError();
  }
  const isAuthValid = auth.check();
  if (!isAuthValid) {
    throw new AuthExpiredeError();
  }
  let token = "";
  if (isAuthValid && !!_authInfo?.access_token) {
    token = _authInfo.access_token;
  } else {
    throw new AuthExpiredeError(); // 其实不会执行到这个逻辑，已经提前报错
  }

  if (url.includes(GoogleAPIUrl) || isDEV) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
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
