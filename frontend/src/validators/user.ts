import { z } from "zod";

export const userSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type UserSearchInput = z.infer<typeof userSearchSchema>;
