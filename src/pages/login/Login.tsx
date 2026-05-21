import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import type { LoginFormData } from "@/features/auth/model/auth.schemas.ts";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    await login({ email: data.email, password: data.password });
    navigate("/feeds");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 gradient-brand px-10 py-12 text-white">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">
            IAM
          </div>
          <span className="font-semibold text-sm">iam-app</span>
        </div>
        <div className="space-y-4">
          <p className="text-3xl font-bold leading-snug">
            Connect, share,<br />and explore.
          </p>
          <p className="text-sm text-white/70">
            Your modern social space — sign in to join the conversation.
          </p>
        </div>
        <p className="text-xs text-white/50">© {new Date().getFullYear()} iam-app</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="gradient-brand h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold">
              IAM
            </div>
            <span className="font-semibold text-sm text-foreground">iam-app</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <LoginForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
