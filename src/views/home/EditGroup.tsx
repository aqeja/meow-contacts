import React, { useCallback, useMemo, useRef, useState } from "react";
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
  TextField,
  DialogProps,
} from "@mui/material";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { GroupDialogViewType, groupDialogDataState } from "@/store/group";
import { useDeleteGroup, useEditGroup, useListGroups } from "@/hooks/useGroups";
import { useToast } from "@/components/Toast";

import { Formik, Form, FormikHelpers } from "formik";

enum EditGroupFormType {
  edit,
  create,
}
export const BaseEditGroup: React.FC<
  {
    editType: EditGroupFormType;
    prevName?: string;
    onConfirm: (arg: { name: string }) => any;
    onCancel: () => void;
  } & DialogProps
> = ({ editType, prevName, onCancel, onConfirm, open, children, ...rest }) => {
  const { data } = useListGroups("", true);
  const groups = useMemo(() => data?.contactGroups ?? [], [data]);

  const onSubmit = useCallback(
    async ({ name: _name }: { name: string }, { setFieldError }: FormikHelpers<{ name: string }>) => {
      const name = _name.trim();
      if (name.length === 0) return;
      if (groups.find((item) => item.name === name)) {
        setFieldError("name", "标签名称已经存在");
        return;
      }
      onConfirm({
        name,
      });
    },
    [groups, onConfirm],
  );

  return (
    <Formik
      initialValues={{
        name: prevName ?? "",
      }}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ errors, values, resetForm, handleChange, handleBlur }) => {
        return (
          <Dialog
            open={open}
            {...rest}
            TransitionProps={{
              ...rest.TransitionProps,
              onExited: (el) => {
                resetForm();
                rest.TransitionProps?.onExited?.(el);
              },
            }}
          >
            <Form>
              <DialogTitle>{editType === EditGroupFormType.create ? "创建标签" : "重命名标签"}</DialogTitle>
              <DialogContent>
                <TextField
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoFocus
                  fullWidth
                  variant="standard"
                  placeholder="新标签"
                  error={!!errors.name}
                  label={!!errors && errors.name}
                />
              </DialogContent>
              <DialogActions>
                <Button size="small" onClick={onCancel}>
                  取消
                </Button>
                <Button size="small" type="submit">
                  保存
                </Button>
              </DialogActions>
            </Form>
          </Dialog>
        );
      }}
    </Formik>
  );
};

export const EditGroup = () => {
  const groupDialogData = useRecoilValue(groupDialogDataState);
  const resetGroupDialogData = useResetRecoilState(groupDialogDataState);

  const { mutateAsync } = useEditGroup();
  const editGroup = useCallback(
    async ({ name: newName }: { name: string }) => {
      if (!groupDialogData.group) return;

      if (newName === "" || newName === groupDialogData.group.name) return;
      await mutateAsync({
        resource: groupDialogData.group.resourceName,
        params: {
          contactGroup: {
            name: newName,
            etag: groupDialogData.group.etag ?? "",
          },
        },
      });
      resetGroupDialogData();
    },
    [groupDialogData, mutateAsync, resetGroupDialogData],
  );
  return (
    <BaseEditGroup
      open={groupDialogData.openType === GroupDialogViewType.edit}
      editType={EditGroupFormType.edit}
      prevName={groupDialogData.group?.name}
      onConfirm={editGroup}
      onCancel={resetGroupDialogData}
    />
  );
};
