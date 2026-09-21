import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  ...noIndexMetadata,
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-1 items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-text-primary">404</h1>
        <p className="mt-2 text-lg text-text-secondary">
          The page you are looking for does not exist.
        </p>
        <Link href={ROUTES.home} className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </div>
    </div>
  );
}
