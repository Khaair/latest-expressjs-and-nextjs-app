"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { createCategoryAction } from "@/features/categories/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import {
  createCategorySchema,
  type CreateCategoryInput,
} from "@/validators/category";

function CreateCategoryForm({
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
  } = useForm<CreateCategoryInput>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  async function onSubmit(values: CreateCategoryInput) {
    setServerError(null);

    const result = await createCategoryAction(values);

    if (result.success) {
      toast.success(result.message ?? "Category created successfully.");
      onSuccess();
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(field as keyof CreateCategoryInput, { type: "server", message });
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

      <Input
        type="text"
        label="Name"
        placeholder="Technology"
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        type="text"
        label="Slug (optional)"
        placeholder="technology"
        error={errors.slug?.message}
        {...register("slug")}
      />

      <Textarea
        label="Description (optional)"
        placeholder="Short description"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} loadingText="Creating...">
          Create Category
        </Button>
      </div>
    </form>
  );
}

export function CreateCategoryModal() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add Category
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Add category"
        description="Create a category. Slug is auto-generated from the name if left empty."
      >
        {open && <CreateCategoryForm onSuccess={handleClose} onCancel={handleClose} />}
      </Modal>
    </>
  );
}
