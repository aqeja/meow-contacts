import React from "react";
import { Box, CircularProgress, LinearProgress, Portal } from "@mui/material";

const Loading = () => {
  return (
    <Box component="div" sx={{ pt: 4 }} className="text-center">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
export const LinearLoading = () => {
  return (
    <Portal>
      <LinearProgress variant="indeterminate" className="!fixed left-0 top-0 z-10 w-full" />
    </Portal>
  );
};
