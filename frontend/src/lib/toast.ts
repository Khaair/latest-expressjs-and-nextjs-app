"use client";

import { toast as sonnerToast, type ExternalToast } from "sonner";

type ToastMessage = string;
type ToastOptions = ExternalToast;

/**
 * Client-only toast helpers. Call these from Client Components
 * (e.g. after Server Actions, React Hook Form submit handlers).
 */
export const toast = {
  success(message: ToastMessage, options?: ToastOptions) {
    return sonnerToast.success(message, options);
  },
  error(message: ToastMessage, options?: ToastOptions) {
    return sonnerToast.error(message, options);
  },
  warning(message: ToastMessage, options?: ToastOptions) {
    return sonnerToast.warning(message, options);
  },
  info(message: ToastMessage, options?: ToastOptions) {
    return sonnerToast.info(message, options);
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
} as const;
