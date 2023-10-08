import React, { Suspense, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

import { Avatar, Box, Button, CircularProgress } from "@mui/material";
import Side from "./Side";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useRestoreScroll } from "@/hooks/useRestoreScroll";
import DeleteContact from "./DeleteContact";
import { login } from "@/api/auth";
import { auth } from "@/common/auth";
import { LinearLoading } from "@/components/Loading";
import "./list-page.scss";

const Home = () => {
  const [isAuthValid, setIsAuthValid] = useState(auth.check().valid);
  const [loading, setLoading] = useState(false);
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/contacts",

    onSuccess: async (codeResponse) => {
      setLoading(true);

      const res = await login(codeResponse.code);
      auth.create(res.data);
      setIsAuthValid(true);
      setLoading(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  useRestoreScroll();
  useEffect(() => {
    if (!isAuthValid && !loading) {
      setTimeout(() => {
        googleLogin();
      }, 100);
    }
  }, [isAuthValid, loading, googleLogin]);
  if (loading) {
    return <LinearLoading />;
  }
  if (!isAuthValid) {
    return (
      <Box component="div" className="h-screen flex items-center justify-center">
        <Avatar src="/contacts_2022_48dp.png" />
        <Box>
          <Button
            sx={{
              textTransform: "none",
            }}
            onClick={googleLogin}
          >
            使用Goole账号登录
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box component="div" className="h-screen flex flex-col list-page">
        <Header />
        <Box component="div" className="relative flex-grow">
          <Side />
          <Box
            component="div"
            className="h-full contact_list_view"
            sx={{
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
