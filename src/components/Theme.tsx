import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d57d0",
    },
    text: {
      primary: "#212121",
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: "#212121",
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: "xs",
        fullWidth: true,
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: 16,
        },
      },
    },
  },
});
const Theme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
