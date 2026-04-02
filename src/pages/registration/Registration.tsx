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
		toast.success("Registration successful!");
		navigate("/feeds");
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

				<RegistrationForm onSubmit={onSubmit} />
			</div>
		</div>
	);
}
