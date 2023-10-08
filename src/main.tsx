import React from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider, QueryClient, QueryCache } from "@tanstack/react-query";
import Toast, { useToast } from "./components/Toast";
import { RecoilRoot } from "recoil";
import Theme from "./components/Theme";
import { isAxiosError } from "axios";

const container = createRoot(document.getElementById("root")!);
const Query: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (count, error) => {
          if (isAxiosError(error) && error.name === "AxiosError") {
            if (error.response?.status && error.response.status >= 500) {
              return count < 3;
            }
          }
          return false;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 300000,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.message) {
          showToast(query.meta?.errorMessage as string);
        }
      },
    }),
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

container.render(
  <RecoilRoot>
    <GoogleOAuthProvider clientId="965998109838-kqapi9e11hfnlthnqu789b6sre1e4pq0.apps.googleusercontent.com">
      <Query>
        <Theme>
          <Router />
          {/* <ScrollRestoration
              getKey={(location, matches) => {
                const paths = ["/"];
                return paths.includes(location.pathname)
                  ? // home and notifications restore by pathname
                    location.pathname
                  : // everything else by location like the browser
                    location.key;
              }}
            /> */}
        </Theme>
        <Toast />
      </Query>
    </GoogleOAuthProvider>
  </RecoilRoot>,
);
