"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";

import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { updateUserAction } from "@/features/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import type { ActionResult } from "@/types/api";
import type { UserListItem } from "@/types/user";

interface EditUserModalProps {
  user: UserListItem;
  onClose: () => void;
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (prev: ActionResult<UserListItem> | null, formData: FormData) => {
      const result = await updateUserAction(prev, formData);
      if (result.success) {
        toast.success(result.message ?? "User updated successfully.");
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
      title="Edit user"
      description="Update this user's profile details and status."
    >
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={user.id} />

        {state?.error && <FormAlert>{state.error}</FormAlert>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            name="firstName"
            type="text"
            label="First name"
            placeholder="Jane"
            defaultValue={user.firstName ?? ""}
            autoComplete="given-name"
            error={state?.fieldErrors?.firstName?.[0]}
          />
          <Input
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Doe"
            defaultValue={user.lastName ?? ""}
            autoComplete="family-name"
            error={state?.fieldErrors?.lastName?.[0]}
          />
        </div>

        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="jane@example.com"
          required
          defaultValue={user.email}
          autoComplete="email"
          error={state?.fieldErrors?.email?.[0]}
        />

        <Select
          name="status"
          label="Status"
          defaultValue={user.status}
          error={state?.fieldErrors?.status?.[0]}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
        </Select>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} loadingText="Saving...">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
