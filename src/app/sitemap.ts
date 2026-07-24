import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://${process.env.VERCEL_BRANCH_URL}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `https://${process.env.VERCEL_BRANCH_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `https://${process.env.VERCEL_BRANCH_URL}/projects/gif-hunter`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `https://${process.env.VERCEL_BRANCH_URL}/projects/spotify-artist-collage`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
    {
      url: `https://${process.env.VERCEL_BRANCH_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
    },
  ];
}
