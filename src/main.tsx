import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router.tsx';
import { Toaster } from 'sonner';
import { AuthProvider } from './features/auth/context/AuthProvider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./app/api/queryClient";
import { ErrorNotificationProvider } from "@/app/providers/ErrorNotificationProvider.tsx";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ErrorNotificationProvider>
				<AuthProvider>
					<RouterProvider router={router}/>
				</AuthProvider>
			</ErrorNotificationProvider>
			<Toaster
				richColors
				closeButton
				position="top-right"/>
		</QueryClientProvider>
	</StrictMode>,
)
