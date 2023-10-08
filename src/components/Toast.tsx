import React, { useState, useEffect, useCallback } from "react";
import { Box, Portal, Slide, SlideProps, Snackbar } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { messagesState, toastOpenState } from "../store/toast";
import { CgSpinner } from "react-icons/cg";

export interface SnackbarMessage {
  message: string;
  key: number;
  duration?: number | null;
}
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export interface State {
  open: boolean;
  snackPack: readonly SnackbarMessage[];
  messageInfo?: SnackbarMessage;
}
export function useToast() {
  const setSnackPack = useSetRecoilState(messagesState);
  const setToastOpen = useSetRecoilState(toastOpenState);
  const showToast = useCallback(
    (message: React.ReactNode, duration: number | null = 3000) => {
      const _duration = typeof duration === "number" && duration > 0 ? duration : null;
      setSnackPack((prev) => [...prev, { message, key: Date.now(), duration: _duration }]);
    },
    [setSnackPack],
  );
  const showLoadingToast = useCallback(
    (message: React.ReactNode) => {
      showToast(
        <Box className="flex items-center">
          <CgSpinner className="animate-spin mx-auto" size={16} />
          <Box component="span" sx={{ ml: 1 }}>
            {message}
          </Box>
        </Box>,
        null,
      );
    },
    [showToast],
  );
  const hideToast = useCallback(() => {
    setToastOpen(false);
  }, [setToastOpen]);
  return {
    showToast,
    showLoadingToast,
    hideToast,
  };
}
const Toast = () => {
  const [open, setOpen] = useRecoilState(toastOpenState);
  const [snackPack, setSnackPack] = useRecoilState(messagesState);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };
  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] } as any);
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open, setOpen, setSnackPack]);
  return (
    <Portal>
      <Snackbar
        TransitionComponent={SlideTransition}
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        sx={{
          bottom: "0!important",
          "& > div": {
            borderRadius: "4px 4px  0 0",
          },
        }}
        autoHideDuration={messageInfo?.duration}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? <Box className="flex items-center">{messageInfo.message}</Box> : undefined}
      />
    </Portal>
  );
};

export default Toast;
