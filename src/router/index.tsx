import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "@/views/home";
import ContactList from "@/views/home/List";
const Person = React.lazy(() => import("@/views/person"));
const LinearProgress = () => {
  return <div>loading...</div>;
};

const NotFound = () => {
  return <div className="p-4">当前页面不存在</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        index: true,
        element: <ContactList />,
      },
      {
        path: "person/:id",
        element: <Person />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const RouterView = () => {
  return (
    <Suspense fallback={<LinearProgress />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
export default RouterView;
