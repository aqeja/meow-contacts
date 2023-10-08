import React, { useCallback } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button } from "@mui/material";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { contactMenuDataState, deleteContactOpenState } from "@/store/contact";
import { useDeleteContact } from "@/hooks/useContacts";
import { useToast } from "@/components/Toast";

const DeleteContact = () => {
  const deleteContactDialogData = useRecoilValue(deleteContactOpenState);
  const resetContactMenuData = useResetRecoilState(contactMenuDataState);
  const resetDeleteContactDialogOpen = useResetRecoilState(deleteContactOpenState);
  const contactMenuData = useRecoilValue(contactMenuDataState);
  const { showToast, hideToast } = useToast();
  const { mutateAsync, isLoading } = useDeleteContact();
  const cancel = useCallback(() => {
    resetContactMenuData();
    resetDeleteContactDialogOpen();
  }, [resetDeleteContactDialogOpen, resetContactMenuData]);
  const deleteContact = useCallback(async () => {
    try {
      showToast("正在进行", null);
      await mutateAsync(contactMenuData.resource);
      hideToast();
      cancel();
      showToast("已删除一个联系人");
    } catch (error) {
      hideToast();
    }
  }, [contactMenuData, mutateAsync, showToast, hideToast, cancel]);
  return (
    <Dialog open={deleteContactDialogData}>
      <DialogTitle>要从通讯录中删除吗？</DialogTitle>
      <DialogContent>
        <Typography>该联系人将在 30 天后从此账号中永久删除。</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>取消</Button>
        <Button onClick={deleteContact} disabled={isLoading}>
          确定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteContact;
