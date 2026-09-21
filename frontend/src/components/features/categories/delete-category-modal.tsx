"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { deleteCategoryAction } from "@/features/categories/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import type { CategoryListItem } from "@/types/category";

interface DeleteCategoryModalProps {
  category: CategoryListItem;
  onClose: () => void;
}

export function DeleteCategoryModal({ category, onClose }: DeleteCategoryModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    if (isPending) return;
    onClose();
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);

      if (result.success) {
        toast.success(result.message ?? "Category deleted successfully.");
        onClose();
        router.refresh();
        return;
      }

      const message = result.error ?? "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    });
  }

  return (
    <Modal
      open
      onClose={handleClose}
      title="Delete category"
      description="This soft-deletes the category. It will no longer appear in the list."
    >
      <div className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}

        <p className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
          Delete <span className="font-medium text-text-primary">{category.name}</span> (
          {category.slug})?
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            loading={isPending}
            loadingText="Deleting..."
            onClick={handleDelete}
          >
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  );
}
