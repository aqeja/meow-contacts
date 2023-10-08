import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <Box component="div" sx={{ pt: 4 }} className="text-center">
      <CircularProgress />
    </Box>
  );
};

export default Loading;
