import * as yup from "yup";
import { z } from "zod";

export const userSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

const optionalName = (label: string) =>
  yup
    .string()
    .trim()
    .max(100, `${label} must be at most 100 characters.`)
    .default("");

export const createUserSchema = yup.object({
  firstName: optionalName("First name"),
  lastName: optionalName("Last name"),
  email: yup
    .string()
    .trim()
    .required("This field is required.")
    .email("Please enter a valid email address."),
  password: yup
    .string()
    .required("This field is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters."),
  confirmPassword: yup
    .string()
    .required("This field is required.")
    .oneOf([yup.ref("password")], "Passwords do not match."),
  status: yup
    .mixed<"ACTIVE" | "INACTIVE" | "PENDING">()
    .oneOf(["ACTIVE", "INACTIVE", "PENDING"], "Invalid status.")
    .required("Status is required.")
    .default("ACTIVE"),
});

export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID."),
  firstName: z
    .string()
    .trim()
    .max(100, "First name must be at most 100 characters.")
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(100, "Last name must be at most 100 characters.")
    .optional(),
  email: z
    .string()
    .min(1, "This field is required.")
    .email("Please enter a valid email address."),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
});

export const deleteUserSchema = z.object({
  id: z.string().uuid("Invalid user ID."),
});

export type UserSearchInput = z.infer<typeof userSearchSchema>;
export type CreateUserInput = yup.InferType<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
