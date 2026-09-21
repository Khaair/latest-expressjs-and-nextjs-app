import * as yup from "yup";
import { z } from "zod";

export const blogSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const createBlogSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(200, "Title must be at most 200 characters."),
  slug: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(220, "Slug must be at most 220 characters.")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase letters, numbers, and hyphens.",
      excludeEmptyString: true,
    })
    .notRequired(),
  content: yup.string().trim().required("This field is required."),
  excerpt: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(500, "Excerpt must be at most 500 characters.")
    .notRequired(),
  published: yup.boolean().default(false),
  categoryId: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .uuid("Invalid category ID.")
    .notRequired(),
});

export const updateBlogSchema = yup.object({
  id: yup.string().uuid("Invalid blog ID.").required(),
  title: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(200, "Title must be at most 200 characters."),
  slug: yup
    .string()
    .trim()
    .required("This field is required.")
    .max(220, "Slug must be at most 220 characters.")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens.",
    ),
  content: yup.string().trim().required("This field is required."),
  excerpt: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .max(500, "Excerpt must be at most 500 characters.")
    .notRequired(),
  published: yup.boolean().required(),
  categoryId: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .uuid("Invalid category ID.")
    .notRequired(),
});

export const deleteBlogSchema = yup.object({
  id: yup.string().uuid("Invalid blog ID.").required(),
});

export type BlogSearchInput = z.infer<typeof blogSearchSchema>;
export type CreateBlogInput = yup.InferType<typeof createBlogSchema>;
export type UpdateBlogInput = yup.InferType<typeof updateBlogSchema>;