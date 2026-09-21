"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      richColors
      position="top-right"
      closeButton
      duration={4000}
      expand={false}
      visibleToasts={4}
    />
  );
}
