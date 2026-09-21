import * as yup from "yup";
import { z } from "zod";

export const categorySearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const createCategorySchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(100, "Name must be at most 100 characters."),
  slug: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(120, "Slug must be at most 120 characters.")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase letters, numbers, and hyphens.",
      excludeEmptyString: true,
    })
    .notRequired(),
  description: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(500, "Description must be at most 500 characters.")
    .notRequired(),
});

export const updateCategorySchema = yup.object({
  id: yup.string().uuid("Invalid category ID.").required(),
  name: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(100, "Name must be at most 100 characters."),
  slug: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(120, "Slug must be at most 120 characters.")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens.",
    ),
  description: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(500, "Description must be at most 500 characters.")
    .optional(),
});

export const deleteCategorySchema = yup.object({
  id: yup.string().uuid("Invalid category ID.").required(),
});

export type CategorySearchInput = z.infer<typeof categorySearchSchema>;
export type CreateCategoryInput = yup.InferType<typeof createCategorySchema>;
export type UpdateCategoryInput = yup.InferType<typeof updateCategorySchema>;
export type DeleteCategoryInput = yup.InferType<typeof deleteCategorySchema>;
