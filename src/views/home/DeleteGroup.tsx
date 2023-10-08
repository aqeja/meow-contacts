import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { GroupDialogViewType, groupDialogDataState } from "@/store/group";
import { useDeleteGroup } from "@/hooks/useGroups";
import { useToast } from "@/components/Toast";

const DeleteGroup = () => {
  const [groupDialogData, setGroupDialogData] = useRecoilState(groupDialogDataState);
  const { mutateAsync } = useDeleteGroup();
  const resetGroupDialogData = useResetRecoilState(groupDialogDataState);
  const { showToast, hideToast } = useToast();
  const [deleteContacts, setDeleteContacts] = useState<"0" | "1">("0");
  const resetDeleteContacts = useCallback(() => {
    setDeleteContacts("0");
  }, []);

  const deleteGroup = useCallback(async () => {
    if (!groupDialogData.group?.resourceName) return;
    showToast("正在进行...", null);
    await mutateAsync({
      resource: groupDialogData.group.resourceName,
      deleteContacts: deleteContacts === "1",
    });
    hideToast();
    resetGroupDialogData();
    showToast(`已删除"${groupDialogData.group.formattedName}"标签`);
  }, [groupDialogData, showToast, deleteContacts, mutateAsync, resetGroupDialogData, hideToast]);
  const hide = useCallback(() => {
    setGroupDialogData((p) => ({
      ...p,
      openType: GroupDialogViewType.close,
    }));
  }, [setGroupDialogData]);
  useEffect(() => {
    if (
      groupDialogData.openType === GroupDialogViewType.close &&
      (!groupDialogData?.group?.memberCount || groupDialogData.group?.memberCount === 0) &&
      !!groupDialogData.group?.resourceName
    ) {
      deleteGroup();
    }
  }, [groupDialogData, deleteGroup]);
  return (
    <Dialog
      open={groupDialogData.openType === GroupDialogViewType.delete}
      TransitionProps={{
        onExited: () => {
          resetGroupDialogData();
          resetDeleteContacts();
        },
      }}
    >
      <DialogTitle>删除此标签</DialogTitle>
      <DialogContent>
        <Typography fontSize={15}>
          此标签中有{groupDialogData.group?.memberCount}位联系人。选择如何处理这些联系人。
        </Typography>
        <RadioGroup
          sx={{ mt: 2, mb: 2 }}
          value={deleteContacts}
          onChange={(_, v) => {
            setDeleteContacts(v as "0" | "1");
          }}
        >
          <FormControlLabel value={"0"} control={<Radio />} label="删除此标签，但保留所有联系人" />
          <FormControlLabel value={"1"} control={<Radio />} label="删除此标签及其中的所有联系人" />
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={hide}>
          取消
        </Button>
        <Button size="small" onClick={deleteGroup}>
          删除
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default DeleteGroup;
