import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

/** Only publicly indexable pages. Auth + dashboard are noindex. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: siteConfig.url,
        },
      },
    },
    {
      url: `${siteConfig.url}${ROUTES.register}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
