"use client";

import { useState } from "react";

import { DeleteBlogModal } from "@/components/features/blogs/delete-blog-modal";
import { EditBlogModal } from "@/components/features/blogs/edit-blog-modal";
import { Button } from "@/components/ui/button";
import type { BlogListItem } from "@/types/blog";

export function BlogRowActions({ blog }: { blog: BlogListItem }) {
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
      {editOpen && <EditBlogModal blog={blog} onClose={() => setEditOpen(false)} />}
      {deleteOpen && <DeleteBlogModal blog={blog} onClose={() => setDeleteOpen(false)} />}
    </>
  );
}