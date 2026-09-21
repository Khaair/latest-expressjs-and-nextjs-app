"use client";

import { useState } from "react";

import { DeleteCategoryModal } from "@/components/features/categories/delete-category-modal";
import { EditCategoryModal } from "@/components/features/categories/edit-category-modal";
import { Button } from "@/components/ui/button";
import type { CategoryListItem } from "@/types/category";

export function CategoryRowActions({ category }: { category: CategoryListItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
          Edit
        </Button>
        <Button type="button" variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
      </div>

      {editOpen && (
        <EditCategoryModal category={category} onClose={() => setEditOpen(false)} />
      )}
      {deleteOpen && (
        <DeleteCategoryModal category={category} onClose={() => setDeleteOpen(false)} />
      )}
    </>
  );
}
