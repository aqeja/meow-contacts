import React, { useCallback, useMemo, useState } from "react";
import { IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { useCreateGroup, useListGroups } from "@/hooks/useGroups";
import { Formik, Form, FormikHelpers } from "formik";
import { useToast } from "@/components/Toast";
const CreateGroup = () => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useCreateGroup();
  const { showToast, hideToast } = useToast();
  const { data } = useListGroups("", true);
  const groups = useMemo(() => data?.contactGroups ?? [], [data]);

  const show = useCallback(() => {
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
  }, []);
  const onSubmit = useCallback(
    async ({ name: _name }: { name: string }, { setFieldError }: FormikHelpers<{ name: string }>) => {
      const name = _name.trim();
      if (name.length === 0) return;
      if (groups.find((item) => item.name === name)) {
        setFieldError("name", "标签名称已经存在");
        return;
      }
      showToast("正在进行...");
      await mutateAsync({ name });
      showToast(`已创建标签"${name}"`);
      hideToast();
      hide();
    },
    [mutateAsync, hide, groups, showToast, hideToast],
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
      <Formik
        initialValues={{
          name: "",
        }}
        onSubmit={onSubmit}
      >
        {({ errors, values, resetForm, handleChange, handleBlur }) => {
          return (
            <Dialog
              open={open}
              onClose={hide}
              TransitionProps={{
                onExited: () => {
                  resetForm();
                },
              }}
            >
              <Form>
                <DialogTitle>创建标签</DialogTitle>
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
                  <Button
                    size="small"
                    onClick={() => {
                      hide();
                    }}
                  >
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
    </>
  );
};
export default CreateGroup;
