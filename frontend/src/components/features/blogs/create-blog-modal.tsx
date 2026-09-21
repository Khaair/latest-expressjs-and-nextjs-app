"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { createBlogAction } from "@/features/blogs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { createBlogSchema, type CreateBlogInput } from "@/validators/blog";

function CreateBlogForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateBlogInput>({
    resolver: yupResolver(createBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      published: false,
      categoryId: "",
    },
  });

  async function onSubmit(values: CreateBlogInput) {
    setServerError(null);
    const result = await createBlogAction(values);

    if (result.success) {
      toast.success(result.message ?? "Blog created successfully.");
      onSuccess();
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(field as keyof CreateBlogInput, { type: "server", message });
      }
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && <FormAlert>{serverError}</FormAlert>}

      <Input label="Title" placeholder="My blog title" error={errors.title?.message} {...register("title")} />
      <Input label="Slug (optional)" placeholder="my-blog-title" error={errors.slug?.message} {...register("slug")} />
      <Textarea label="Content" placeholder="Write your post..." error={errors.content?.message} {...register("content")} />
      <Textarea label="Excerpt (optional)" placeholder="Short summary" error={errors.excerpt?.message} {...register("excerpt")} />
      <Input label="Category ID (optional)" placeholder="uuid" error={errors.categoryId?.message} {...register("categoryId")} />

      <label className="flex items-center gap-2 text-sm text-text-secondary">
        <input type="checkbox" className="h-4 w-4" {...register("published")} />
        Published
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} loadingText="Creating...">
          Create Blog
        </Button>
      </div>
    </form>
  );
}

export function CreateBlogModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Blog
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add blog"
        description="Create a new blog post. Slug is optional."
      >
        {open && (
          <CreateBlogForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
        )}
      </Modal>
    </>
  );
}