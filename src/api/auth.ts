import { GoogleAuth } from "@/common/auth";
import client from "@/common/request";
import { AxiosRequestConfig } from "axios";

const baseUrl = import.meta.env.PROD ? "https://meow-contacts.vercel.app/api/" : "http://localhost:5173/authapi/";
export const login = (code: string) => {
  return client.post<GoogleAuth>(
    `${baseUrl}auth`,
    {
      code,
    },
    {
      CUSTOM: {
        auth: false,
      },
    } as AxiosRequestConfig,
  );
};

export const refreshToken = (refreshToken: string) => {
  return client.post<GoogleAuth>(
    `${baseUrl}refresh`,
    {
      refreshToken,
    },
    {
      CUSTOM: {
        auth: false,
      },
    } as AxiosRequestConfig,
  );
};
