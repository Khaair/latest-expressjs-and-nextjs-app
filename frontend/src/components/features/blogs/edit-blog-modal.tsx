"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { updateBlogAction } from "@/features/blogs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import type { BlogListItem } from "@/types/blog";
import { updateBlogSchema, type UpdateBlogInput } from "@/validators/blog";

export function EditBlogModal({
  blog,
  onClose,
}: {
  blog: BlogListItem;
  onClose: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBlogInput>({
    resolver: yupResolver(updateBlogSchema),
    defaultValues: {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt ?? "",
      published: blog.published,
      categoryId: blog.categoryId ?? "",
    },
  });

  async function onSubmit(values: UpdateBlogInput) {
    setServerError(null);
    const result = await updateBlogAction(values);

    if (result.success) {
      toast.success(result.message ?? "Blog updated successfully.");
      onClose();
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(field as keyof UpdateBlogInput, { type: "server", message });
      }
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
    }
  }

  return (
    <Modal open onClose={onClose} title="Edit blog" description="Update this blog post.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...register("id")} />
        {serverError && <FormAlert>{serverError}</FormAlert>}

        <Input label="Title" error={errors.title?.message} {...register("title")} />
        <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
        <Textarea label="Content" error={errors.content?.message} {...register("content")} />
        <Textarea label="Excerpt (optional)" error={errors.excerpt?.message} {...register("excerpt")} />
        <Input label="Category ID (optional)" error={errors.categoryId?.message} {...register("categoryId")} />

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input type="checkbox" className="h-4 w-4" {...register("published")} />
          Published
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting} loadingText="Saving...">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}