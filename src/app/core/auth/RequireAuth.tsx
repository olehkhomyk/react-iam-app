import { Navigate } from "react-router-dom";
 import { useAuth } from "./useAuth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return null;
	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return <>{children}</>;
}
