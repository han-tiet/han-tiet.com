import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/projects/spotify-artist-collage/login",
        "/projects/spotify-artist-collage/api/",
      ],
    },
    sitemap: `https://${process.env.VERCEL_BRANCH_URL}/sitemap.xml`,
  };
}
