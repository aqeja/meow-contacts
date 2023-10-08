import { refreshToken } from "@/api/auth";

export interface GoogleAuth {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
  expiry_date: number;
}

class Auth {
  private name = "_APP_AUTH_STORAGE";
  private _getAuth(): GoogleAuth | null {
    const item = window.localStorage.getItem(this.name) ?? "";

    try {
      return !!item ? JSON.parse(item) : null;
    } catch (error) {
      return null;
    }
  }
  check() {
    const auth = this._getAuth();
    const result = {
      valid: false,
      refresh: true,
      refresh_token: "",
    };
    if (!auth) return result;
    try {
      const { expiry_date, access_token, refresh_token } = auth;
      if (typeof expiry_date === "number" && expiry_date > Date.now() && !!access_token) {
        return {
          valid: true,
          refresh: false,
          refresh_token,
        };
      } else {
        return {
          valid: true,
          refresh: true,
          refresh_token,
        };
      }
    } catch (error) {
      this.remove();
    }
    return result;
  }
  create(auth: GoogleAuth) {
    window.localStorage.setItem(this.name, JSON.stringify(auth));
  }
  remove() {
    window.localStorage.removeItem(this.name);
  }
  async get() {
    const { valid, refresh, refresh_token } = this.check();

    if (valid && refresh && !!refresh) {
      const { data } = await refreshToken(refresh_token);
      this.create({
        ...data,
        refresh_token,
      });
    }
    return this._getAuth();
  }
}
export const auth = new Auth();
