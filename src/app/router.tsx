import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./core/auth/RequireAuth.tsx";
import Registration from "./pages/Registration.tsx";

export const router = createBrowserRouter([
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Registration /> },
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
]);
