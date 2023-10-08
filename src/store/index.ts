import { atom } from "recoil";
import { Location } from "react-router-dom";
export const prevLocationState = atom<Location | null>({
  key: "app/prevLocation",
  default: null,
});

export const contactListElementState = atom<HTMLElement | null>({
  key: "app/contactListElementState",
  default: null,
});
