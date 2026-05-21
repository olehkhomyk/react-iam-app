import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import type { RegistrationFormData } from "@/features/auth/model/RegistrationForm.ts";
import { RegistrationForm } from "@/features/auth/ui/RegistrationForm";

export default function Registration() {
	const navigate = useNavigate();
	const { register: authRegister } = useAuth();

	const onSubmit = async (data: RegistrationFormData) => {
		await authRegister({
			email: data.email,
			password: data.password,
			username: data.username,
			firstName: data.firstName,
			lastName: data.lastName,
			confirmPassword: data.confirmPassword,
		});
		toast.success("Account created!");
		navigate("/feeds");
	};

	return (
		<div className="min-h-screen flex">
			{/* Left branding panel */}
			<div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 gradient-brand px-10 py-12 text-white">
				<div className="flex items-center gap-2.5">
					<div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center text-xs font-bold">
						IAM
					</div>
					<span className="font-semibold text-sm">iam-app</span>
				</div>
				<div className="space-y-4">
					<p className="text-3xl font-bold leading-snug">
						Join the<br />community.
					</p>
					<p className="text-sm text-white/70">
						Create your account and start sharing with people around you.
					</p>
				</div>
				<p className="text-xs text-white/50">© {new Date().getFullYear()} iam-app</p>
			</div>

			{/* Right form panel */}
			<div className="flex-1 flex items-center justify-center bg-background px-6 py-12 overflow-y-auto">
				<div className="w-full max-w-sm space-y-6">
					{/* Mobile brand */}
					<div className="lg:hidden flex items-center gap-2 mb-2">
						<div className="gradient-brand h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold">
							IAM
						</div>
						<span className="font-semibold text-sm text-foreground">iam-app</span>
					</div>

					<div className="space-y-1">
						<h1 className="text-2xl font-bold text-foreground">Create account</h1>
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
								Sign in
							</Link>
						</p>
					</div>

					<RegistrationForm onSubmit={onSubmit} />
				</div>
			</div>
		</div>
	);
}
