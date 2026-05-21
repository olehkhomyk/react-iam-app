import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type RegistrationFormData, registrationSchema } from "@/features/auth/model/auth.schemas.ts";
import { Spinner } from "@/components/ui/spinner";

type RegistrationFormProps = {
  onSubmit: (data: RegistrationFormData) => Promise<void> | void;
};

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onSubmit",
    defaultValues: {
      agreeTerms: false,
    },
  });

  const handleFormSubmit = async (data: RegistrationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <FieldContent>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
            placeholder="you@example.com"
            className="rounded-lg"
          />
          <FieldError errors={[errors.email]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <FieldContent>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            aria-invalid={!!errors.username}
            {...register("username")}
            placeholder="Choose a username"
            className="rounded-lg"
          />
          <FieldError errors={[errors.username]} />
        </FieldContent>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="firstName">First name</FieldLabel>
          <FieldContent>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              {...register("firstName")}
              placeholder="First"
              className="rounded-lg"
            />
            <FieldError errors={[errors.firstName]} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="lastName">Last name</FieldLabel>
          <FieldContent>
            <Input
              id="lastName"
              type="text"
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              {...register("lastName")}
              placeholder="Last"
              className="rounded-lg"
            />
            <FieldError errors={[errors.lastName]} />
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <FieldContent>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
            placeholder="••••••••"
            className="rounded-lg"
          />
          <FieldError errors={[errors.password]} />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
        <FieldContent>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
            placeholder="••••••••"
            className="rounded-lg"
          />
          <FieldError errors={[errors.confirmPassword]} />
        </FieldContent>
      </Field>

      <Controller
        control={control}
        name="agreeTerms"
        render={({ field }) => (
          <Field orientation="horizontal">
            <FieldLabel htmlFor="agree-terms" className="flex items-start gap-2 cursor-pointer">
              <Checkbox
                id="agree-terms"
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                className="mt-0.5"
              />
              <p className="text-sm text-muted-foreground leading-tight">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:text-primary/80 transition-colors">Privacy Policy</a>
              </p>
            </FieldLabel>
          </Field>
        )}
      />
      <FieldError errors={[errors.agreeTerms]} />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white gradient-brand shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? <Spinner className="h-4 w-4 text-white" /> : "Create account"}
      </button>
    </form>
  );
}
