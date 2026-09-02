import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "This field is required."),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "This field is required.")
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be at most 100 characters."),
    email: z
      .string()
      .min(1, "This field is required.")
      .email("Please enter a valid email address."),
    password: z
      .string()
      .min(1, "This field is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[0-9]/, "Password must contain a number."),
    confirmPassword: z.string().min(1, "This field is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "This field is required.")
    .email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required."),
    password: z
      .string()
      .min(1, "This field is required.")
      .min(8, "Password must be at least 8 characters.")
      .regex(/[a-z]/, "Password must contain a lowercase letter.")
      .regex(/[A-Z]/, "Password must contain an uppercase letter.")
      .regex(/[0-9]/, "Password must contain a number."),
    confirmPassword: z.string().min(1, "This field is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
