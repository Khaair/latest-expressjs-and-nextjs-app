export const siteConfig = {
  name: "Acme Platform",
  description: "Production-grade Next.js application",
  url: process.env.APP_URL ?? "http://localhost:3000",
} as const;
