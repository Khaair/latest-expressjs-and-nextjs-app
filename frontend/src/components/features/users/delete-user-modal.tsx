"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { deleteUserAction } from "@/features/users/actions";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";
import type { UserListItem } from "@/types/user";

interface DeleteUserModalProps {
  user: UserListItem;
  onClose: () => void;
}

export function DeleteUserModal({ user, onClose }: DeleteUserModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionResult | null, formData: FormData) => {
      const result = await deleteUserAction(prev, formData);
      if (result.success) {
        toast.success(result.message ?? "User deleted successfully.");
        onClose();
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  function handleClose() {
    if (isPending) return;
    onClose();
  }

  return (
    <Modal
      open
      onClose={handleClose}
      title="Delete user"
      description="This soft-deletes the account. The user will no longer appear in the list or be able to sign in."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={user.id} />

        {state?.error && <FormAlert>{state.error}</FormAlert>}

        <p className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
          Delete{" "}
          <span className="font-medium text-text-primary">{user.name}</span> (
          {user.email})?
        </p>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" loading={isPending} loadingText="Deleting...">
            Delete User
          </Button>
        </div>
      </form>
    </Modal>
  );
}
