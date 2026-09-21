export const siteConfig = {
  name: "Acme Platform",
  shortName: "Acme",
  description:
    "Production-ready Next.js platform with authentication, user management, and a premium admin dashboard connected to an Express REST API.",
  url: process.env.APP_URL ?? "http://localhost:3000",
  locale: "en_US",
  keywords: [
    "Next.js",
    "admin dashboard",
    "authentication",
    "user management",
    "Express API",
    "Acme Platform",
  ],
} as const;
