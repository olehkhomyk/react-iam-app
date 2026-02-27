import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/router.tsx";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth/provider/AuthProvider.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/api/queryClient";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<RouterProvider router={router}/>
			</AuthProvider>
			<Toaster richColors position="top-right"/>
		</QueryClientProvider>
	</StrictMode>,
)
