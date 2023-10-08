import { atom } from "recoil";

export const toastOpenState = atom({
  key: "toast/open",
  default: false,
});

export const messagesState = atom<{ message: React.ReactNode; key: number }[]>({
  key: "toast/messages",
  default: [],
});
