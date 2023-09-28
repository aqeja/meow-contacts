import React from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
const container = createRoot(document.getElementById("root")!);

container.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="965998109838-tg06p5dfejuhee6vdkdmfvrm5r992kt3.apps.googleusercontent.com">
      <Router />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);