import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
 import { useAuth } from "@/features/auth/context/useAuth.ts";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success("Login successful!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Example: server says "invalid credentials"
      setError("email", { message: "Invalid login or password" });
    }
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
        
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-2xl border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
            <div className="space-y-6">
              <Field>
                <FieldLabel htmlFor="login">Email</FieldLabel>
                <FieldContent>
                  <Input
                    className="border-gray-500"
                    id="login"
                    type="text"
                    autoComplete="username"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    placeholder="Enter your login"
                  />
                  <FieldError errors={[errors.email]} />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Input
                    className="border-gray-500"
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    placeholder="Enter your password"
                  />
                  <FieldError errors={[errors.password]} />
                </FieldContent>
              </Field>

              <div>
                <Controller
                  control={control}
                  name="remember"
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="remember-me" className="flex items-center justify-center">
                        <Checkbox
                          className="border-gray-500"
                          id="remember-me"
                          checked={!!field.value}
                          onCheckedChange={(checked) => field.onChange(checked === true)}
                        />
                        Remember me
                      </FieldLabel>
                    </Field>
                  )}
                />

                <div className="text-sm text-center">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                  isSubmitting
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}