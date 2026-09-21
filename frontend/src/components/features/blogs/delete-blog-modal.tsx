"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { deleteBlogAction } from "@/features/blogs/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import type { BlogListItem } from "@/types/blog";

export function DeleteBlogModal({
  blog,
  onClose,
}: {
  blog: BlogListItem;
  onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteBlogAction(blog.id);
      if (result.success) {
        toast.success(result.message ?? "Blog deleted successfully.");
        onClose();
        router.refresh();
        return;
      }
      const message = result.error ?? "Something went wrong.";
      setError(message);
      toast.error(message);
    });
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Delete blog"
      description="This soft-deletes the blog. It will no longer appear in the list."
    >
      <div className="space-y-4">
        {error && <FormAlert>{error}</FormAlert>}
        <p className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
          Delete <span className="font-medium text-text-primary">{blog.title}</span>?
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={isPending} loadingText="Deleting..." onClick={handleDelete}>
            Delete Blog
          </Button>
        </div>
      </div>
    </Modal>
  );
}