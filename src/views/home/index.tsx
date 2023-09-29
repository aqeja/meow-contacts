import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Home = () => {
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/contacts",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const tokens = await axios.post("https://meow-contacts.vercel.app/api/auth", {
        code: codeResponse.code,
      });
      const token = tokens.data.access_token;
      console.log(tokens.data);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });
  return (
    <div>
      <p>这是 Meow Contacts 主页</p>
      <p>This is the Home Page of Meow Contacts</p>
      <button
        onClick={() => {
          googleLogin();
        }}
      >
        test login
      </button>
    </div>
  );
};

export default Home;
