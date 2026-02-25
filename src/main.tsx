import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router.tsx";
import { Toaster } from "sonner";
 import { AuthProvider } from "./app/core/auth/AuthProvider";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    <Toaster richColors position="top-right" />
  </StrictMode>,
)
