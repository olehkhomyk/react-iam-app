import { createBrowserRouter } from "react-router-dom";
import Login from "../../pages/login/Login.tsx";
import Dashboard from "../../pages/dashboard/Dashboard.tsx";
import RequireAuth from "./RequireAuth.tsx";
import Registration from "../../pages/registration/Registration.tsx";
import { AppLayout } from "@/app/layout/AppLayout.tsx";

export const router = createBrowserRouter([
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Registration /> },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
    ],
  },
]);
