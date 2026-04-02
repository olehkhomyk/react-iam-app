import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	remember: z.boolean().optional(),
});


export const registrationSchema = z
	.object({
		email: z.email("Please enter a valid email address"),
		username: z.string().min(3, "Username must be at least 3 characters"),
		firstName: z.string().min(2, "First name must be at least 2 characters"),
		lastName: z.string().min(2, "Last name must be at least 2 characters"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
		agreeTerms: z.boolean().refine((value) => value === true, "You must agree to the terms and conditions"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;
