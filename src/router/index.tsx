import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components";
import Home from "@/views/home";

const LinearProgress = () => {
  return <div>loading...</div>;
};

const NotFound = () => {
  return <div>not found...</div>;
};

const InternalRoute: React.FC<{ title: string; children?: React.ReactNode }> = ({ children, title, ...rest }) => {
  useEffect(() => {
    const title = document.title;
    document.title = `${title}`;
    return () => {
      document.title = title;
    };
  }, [title]);
  return <>{children}</>;
};
const RouterView = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <BrowserRouter basename="/">
        <ErrorBoundary hasError={false}>
          <Routes>
            <Route
              path="/"
              element={
                <InternalRoute title="index">
                  <Home />
                </InternalRoute>
              }
            />
            <Route
              path="*"
              element={
                <InternalRoute title="404">
                  <NotFound />
                </InternalRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </Suspense>
  );
};

export default RouterView;
