import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginFormData, loginSchema } from "@/features/auth/model/auth.schemas.ts";
import { Spinner } from "@/components/ui/spinner";

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
      setError("email", { message: "Invalid email or password" });
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Field>
        <FieldLabel htmlFor="login">Email</FieldLabel>
        <FieldContent>
          <Input
            id="login"
            type="text"
            autoComplete="username"
            {...register("email")}
            aria-invalid={!!errors.email}
            placeholder="you@example.com"
            className="rounded-lg"
          />
          <FieldError errors={[errors.email]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <FieldContent>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            aria-invalid={!!errors.password}
            placeholder="••••••••"
            className="rounded-lg"
          />
          <FieldError errors={[errors.password]} />
        </FieldContent>
      </Field>

      <div className="flex items-center justify-between">
        <Controller
          control={control}
          name="remember"
          render={({ field }) => (
            <Field orientation="horizontal">
              <FieldLabel htmlFor="remember-me" className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="remember-me"
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </FieldLabel>
            </Field>
          )}
        />
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : "Sign in"}
      </button>
    </form>
  );
}
