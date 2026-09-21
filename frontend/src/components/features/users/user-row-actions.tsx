"use client";

import { useState } from "react";

import { DeleteUserModal } from "@/components/features/users/delete-user-modal";
import { EditUserModal } from "@/components/features/users/edit-user-modal";
import { Button } from "@/components/ui/button";
import type { UserListItem } from "@/types/user";

export function UserRowActions({ user }: { user: UserListItem }) {
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

      {editOpen && <EditUserModal user={user} onClose={() => setEditOpen(false)} />}
      {deleteOpen && <DeleteUserModal user={user} onClose={() => setDeleteOpen(false)} />}
    </>
  );
}
