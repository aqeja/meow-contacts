import React, { Suspense, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Box, Button, CircularProgress } from "@mui/material";
import Side from "./Side";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useRestoreScroll } from "@/hooks/useRestoreScroll";
import DeleteContact from "./DeleteContact";
import { login } from "@/api/auth";
import { auth } from "@/common/auth";

const Home = () => {
  const [isLoading, setIsLoading] = useState(!auth.check());
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/contacts",
    onSuccess: async (codeResponse) => {
      const res = await login(codeResponse.code);
      auth.create(res.data);
      setIsLoading(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  useRestoreScroll();
  useEffect(() => {
    if (isLoading) {
      googleLogin();
    }
  }, [isLoading, googleLogin]);

  if (isLoading) {
    return (
      <>
        <Button onClick={googleLogin}>点击登录</Button>
      </>
    );
  }
  return (
    <>
      <Box component="div" className="h-screen flex flex-col">
        <Header />
        <Box component="div" className="relative flex-grow">
          <Side />
          <Box
            component="div"
            className="h-full"
            sx={{
              marginLeft: "280px",
              pl: 2,
            }}
          >
            <Suspense
              fallback={
                <Box
                  component="div"
                  className="flex items-center justify-center"
                  sx={{
                    pt: "10vh",
                  }}
                >
                  <CircularProgress />
                </Box>
              }
            >
              <Outlet />
            </Suspense>
          </Box>
        </Box>
      </Box>
      <DeleteContact />
    </>
  );
};

export default Home;
