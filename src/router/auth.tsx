import React from "react";
import { useLocation, Navigate } from "react-router-dom";
// import { useParams } from "react-router";

export const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (false) {
    //
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return children;
};

export const StudioAuthRoute = ({ children }: { children: JSX.Element }) => {
  return children;
};
