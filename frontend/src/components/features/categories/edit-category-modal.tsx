"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { updateCategoryAction } from "@/features/categories/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import type { CategoryListItem } from "@/types/category";
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from "@/validators/category";

interface EditCategoryModalProps {
  category: CategoryListItem;
  onClose: () => void;
}

export function EditCategoryModal({ category, onClose }: EditCategoryModalProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCategoryInput>({
    resolver: yupResolver(updateCategorySchema),
    defaultValues: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
    },
  });

  async function onSubmit(values: UpdateCategoryInput) {
    setServerError(null);

    const result = await updateCategoryAction(values);

    if (result.success) {
      toast.success(result.message ?? "Category updated successfully.");
      onClose();
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(field as keyof UpdateCategoryInput, { type: "server", message });
      }
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    onClose();
  }

  return (
    <Modal
      open
      onClose={handleClose}
      title="Edit category"
      description="Update this category's name, slug, and description."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...register("id")} />

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
          label="Slug"
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
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
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
