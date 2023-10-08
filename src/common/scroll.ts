export class ScrollStorage {
  private key = "app_scroll_disatance";
  private getStorage(): Record<string, number> {
    const value = window.sessionStorage.getItem(this.key);
    if (!value) return {};
    try {
      return JSON.parse(value);
    } catch (error) {
      return {};
    }
  }
  set({ path, scrollTop }: { path: string; scrollTop: number }) {
    const prev = this.getStorage();
    window.sessionStorage.setItem(
      this.key,
      JSON.stringify({
        ...prev,
        [path]: scrollTop,
      }),
    );
  }
  getPahScrollTop(path: string) {
    const storage = this.getStorage();
    const value = storage[path] ?? 0;
    return value;
  }
}

export const scrollStorage = new ScrollStorage();
