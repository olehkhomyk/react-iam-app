import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";

const registrationSchema = z.object({
	email: z.email("Please enter a valid email address"),
	username: z.string().min(3, "Username must be at least 3 characters"),
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	confirmPassword: z.string(),
	agreeTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
}).refine(data => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function Registration() {
	const navigate = useNavigate();
	const { register: authRegister } = useAuth();
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

	const onSubmit = async (data: RegistrationFormData) => {
		try {
			await authRegister({
				email: data.email,
				password: data.password,
				username: data.username,
				firstName: data.firstName,
				lastName: data.lastName,
				confirmPassword: data.confirmPassword,
			});
			toast.success("Registration successful!");
			navigate('/feeds');
		} catch (err: any) {
				console.error(err);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10 sm:px-6 lg:px-8">
			<div className="w-full max-w-md">
				<div>
					<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600">
						<svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
							      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
						</svg>
					</div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{' '}
						<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
							sign in to your existing account
						</Link>
					</p>
				</div>

				<form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
					<div className="rounded-2xl border border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-8">
						<div className="space-y-6">
							<Field>
								<FieldLabel htmlFor="email">Email Address</FieldLabel>
								<FieldContent>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										aria-invalid={!!errors.email}
										{...register("email")}
										placeholder="Enter your email"
										className="border-gray-500"
									/>
									<FieldError errors={[errors.email]} />
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="username">Login</FieldLabel>
								<FieldContent>
									<Input
										id="username"
										type="text"
										autoComplete="username"
										aria-invalid={!!errors.username}
										{...register("username")}
										placeholder="Choose a login"
										className="border-gray-500"
									/>
									<FieldError errors={[errors.username]} />
								</FieldContent>
							</Field>

							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="firstName">First name</FieldLabel>
									<FieldContent>
										<Input
											id="firstName"
											type="text"
											autoComplete="given-name"
											aria-invalid={!!errors.firstName}
											{...register("firstName")}
											placeholder="First name"
											className="border-gray-500"
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
											placeholder="Last name"
											className="border-gray-500"
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
										placeholder="Create a password"
										className="border-gray-500"
									/>
									<FieldError errors={[errors.password]} />
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
								<FieldContent>
									<Input
										id="confirmPassword"
										type="password"
										autoComplete="new-password"
										aria-invalid={!!errors.confirmPassword}
										{...register("confirmPassword")}
										placeholder="Confirm your password"
										className="border-gray-500"
									/>
									<FieldError errors={[errors.confirmPassword]} />
								</FieldContent>
							</Field>

							<Controller
								control={control}
								name="agreeTerms"
								render={({ field }) => (
									<Field orientation="horizontal">
										<FieldLabel htmlFor="agree-terms">
											<Checkbox
												id="agree-terms"
												checked={!!field.value}
												onCheckedChange={(checked) => field.onChange(checked === true)}
												className="border-gray-500"
											/>
											<p>
												I agree to the{' '}
												<a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
													Terms and Conditions
												</a>{' '}
												and{' '}
												<a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors">
													Privacy Policy
												</a>
											</p>
										</FieldLabel>
									</Field>
								)}
							/>
							<FieldError errors={[errors.agreeTerms]} />

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
									<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
									     viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor"
										      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
								) : (
									'Create Account'
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}