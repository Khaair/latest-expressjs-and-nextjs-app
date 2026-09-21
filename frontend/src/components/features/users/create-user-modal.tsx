"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { FormAlert } from "@/components/features/auth/auth-layout-parts";
import { createUserAction } from "@/features/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-input";
import { Select } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import {
  createUserSchema,
  type CreateUserInput,
} from "@/validators/user";

function CreateUserForm({
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
  } = useForm<CreateUserInput>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      status: "ACTIVE",
    },
  });

  async function onSubmit(values: CreateUserInput) {
    setServerError(null);

    const result = await createUserAction(values);

    if (result.success) {
      toast.success(result.message ?? "User created successfully.");
      onSuccess();
      router.refresh();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        const message = messages[0];
        if (!message) continue;
        setError(field as keyof CreateUserInput, { type: "server", message });
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="text"
          label="First name"
          placeholder="Jane"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          type="text"
          label="Last name"
          placeholder="Doe"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        type="email"
        label="Email address"
        placeholder="jane@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <PasswordInput
        label="Password"
        placeholder="Password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <PasswordInput
        label="Confirm password"
        placeholder="Confirm password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Select label="Status" error={errors.status?.message} {...register("status")}>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="PENDING">Pending</option>
      </Select>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} loadingText="Creating...">
          Create User
        </Button>
      </div>
    </form>
  );
}

export function CreateUserModal() {
  const [open, setOpen] = useState(false);

  function handleClose() {
    if (open) setOpen(false);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add User
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title="Add user"
        description="Create a new user account. They can sign in with the email and password you set."
      >
        {open && <CreateUserForm onSuccess={handleClose} onCancel={handleClose} />}
      </Modal>
    </>
  );
}
