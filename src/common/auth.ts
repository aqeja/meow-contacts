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
    if (!auth) return false;
    try {
      const { expiry_date, access_token } = auth;
      if (typeof expiry_date === "number" && expiry_date < Date.now() && !!access_token) {
        return true;
      } else {
        this.remove();
      }
    } catch (error) {
      this.remove();
    }
    return false;
  }
  create(auth: GoogleAuth) {
    window.localStorage.setItem(this.name, JSON.stringify(auth));
  }
  remove() {
    window.localStorage.removeItem(this.name);
  }
  get() {
    return this._getAuth();
  }
}
export const auth = new Auth();
