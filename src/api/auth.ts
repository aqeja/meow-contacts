import { GoogleAuth } from "@/common/auth";
import client from "@/common/request";

const baseUrl = import.meta.env.PROD ? "https://meow-contacts.vercel.app/api/" : "http://localhost:5173/authapi/";
export const login = (code: string) => {
  return client.post<GoogleAuth>(`${baseUrl}auth`, {
    code,
  });
};

export const refreshToken = (refreshToken: string) => {
  return client.post<GoogleAuth>(`${baseUrl}refresh`, {
    refreshToken,
  });
};
