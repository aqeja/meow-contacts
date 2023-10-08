import { ListContactsResponse } from "@/types/listContacts";
import { atom } from "recoil";

export const contactMenuDataState = atom<{
  anchor: HTMLElement | null;
  resource: string;
  contact: ListContactsResponse["connections"][number] | null;
}>({
  default: {
    anchor: null,
    resource: "",
    contact: null,
  },
  key: "contact/contactMenuData",
});

export const deleteContactOpenState = atom({
  default: false,
  key: "contact/deleteContactOpen",
});
