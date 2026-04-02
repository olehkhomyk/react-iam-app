import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import type { LoginFormData } from "@/features/auth/model/LoginForm.ts";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    await login({ email: data.email, password: data.password });
    toast.success("Login successful!");
    navigate("/feeds");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              create a new account
            </Link>
          </p>
        </div>
        
        <LoginForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
