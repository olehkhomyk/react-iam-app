import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormData } from "@/features/auth/model/LoginForm.ts";

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      remember: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Login failed:", error);
      setError("email", { message: "Invalid login or password" });
    }
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit(handleFormSubmit)}>
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
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
