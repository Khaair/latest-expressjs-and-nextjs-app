import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/api/auth";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Premium admin platform`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} — Premium admin platform`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    title: `${siteConfig.name} — Premium admin platform`,
    description: siteConfig.description,
  },
};

const features = [
  {
    title: "Next.js UI",
    description: "App Router, Server Components, and client forms for interactivity.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Express REST API",
    description: "Your backend owns auth, database access, and business rules.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Clean separation",
    description: "Frontend calls the API via a typed client in src/lib/api/.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M16 3h5v5M8 3H3v5M3 16v5h5M21 16v5h-5M21 3l-9 9M3 21l9-9" />
      </svg>
    ),
  },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        inLanguage: "en",
      },
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
      },
      {
        "@type": "SoftwareApplication",
        name: siteConfig.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: siteConfig.description,
        url: siteConfig.url,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="relative overflow-hidden">
      <JsonLd />

      {/* Hero background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_top,var(--accent-muted)_0%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="accent" className="mb-6">
            {siteConfig.name}
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Production-ready platform with a{" "}
            <span className="text-text-accent">premium admin</span> experience
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
            Next.js frontend connected to your Express REST API. Authentication, user
            management, and a polished dashboard — all with light and dark mode.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            {user ? (
              <Link href={ROUTES.dashboard}>
                <Button size="lg">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href={ROUTES.register}>
                  <Button size="lg">Get started</Button>
                </Link>
                <Link href={ROUTES.login}>
                  <Button variant="secondary" size="lg">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature cards */}
        <div className="mx-auto mt-24 grid max-w-5xl gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-all hover:border-border-strong hover:shadow-md"
            >
              <CardHeader className="mb-3">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-text-accent">
                  {feature.icon}
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription>{feature.description}</CardDescription>
            </Card>
          ))}
        </div>

        {/* Stats strip */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { label: "Auth API", value: "Ready" },
            { label: "User Management", value: "Live" },
            { label: "Theme Support", value: "Light + Dark" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface-muted/60 px-5 py-4 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {stat.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
