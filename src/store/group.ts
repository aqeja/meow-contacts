import { ListGroupsResponse } from "@/types/listGroups";
import { atom } from "recoil";

export enum GroupDialogViewType {
  delete,
  edit,
  close,
}

export const groupDialogDataState = atom<{
  openType: GroupDialogViewType;
  group: ListGroupsResponse["contactGroups"][number] | null;
}>({
  key: "group/groupDialogData",
  default: {
    openType: GroupDialogViewType.close,
    group: null,
  },
});
