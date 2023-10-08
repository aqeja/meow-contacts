import React, { useCallback, useState } from "react";
import { IconButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { useCreateGroup } from "@/hooks/useGroups";
import { useToast } from "@/components/Toast";
import { BaseEditGroup, EditGroupFormType } from "./EditGroup";
const CreateGroup = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isLoading } = useCreateGroup();
  const { showToast, hideToast } = useToast();

  const show = useCallback(() => {
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
  }, []);
  const onSubmit = useCallback(
    async ({ name }: { name: string }) => {
      if (isLoading) return;

      try {
        showToast("正在进行...");
        await mutateAsync({ name });
        showToast(`已创建标签"${name}"`);
        hideToast();
        hide();
      } catch (error) {
        hideToast();
      }
    },
    [mutateAsync, hide, showToast, hideToast, isLoading],
  );

  return (
    <>
      <IconButton
        size="small"
        sx={{
          p: 0,
        }}
        onClick={show}
      >
        <MdAdd size={20} />
      </IconButton>
      <BaseEditGroup open={open} editType={EditGroupFormType.create} onConfirm={onSubmit} onCancel={hide} />
    </>
  );
};
export default CreateGroup;
