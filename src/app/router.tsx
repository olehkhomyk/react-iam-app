import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RequireAuth from "./auth/RequireAuth";

export const router = createBrowserRouter([
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
	{
		path: "/",
		element: (
			<RequireAuth>
				<Dashboard />
			</RequireAuth>
		),
	},
]);
