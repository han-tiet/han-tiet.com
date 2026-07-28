import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { ROUTES } from "@/constants/routes";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [
      `${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
      `www.${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
      `${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
      `www.${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
      `${process.env.NEXT_PUBLIC_HOST}`,
    ],
    protocol: "https",
    fallback: "https://han-tiet.com",
  },

  basePath: ROUTES.SPOTIFY_ARTIST_COLLAGE__AUTH_API,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
    `https://*.${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`,
    `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
    `https://*.${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`,
    `https://${process.env.NEXT_PUBLIC_HOST}`,
  ], // Added index to trusted origins to remove NextJS warning

  socialProviders: {
    // Add provider for Spotify OAuth login page
    spotify: {
      clientId: process.env.SPOTIFY_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
      scope: ["user-top-read", "user-read-recently-played"],
      redirectURI: `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.NEXT_PUBLIC_HOST}/projects/spotify-artist-collage/api/auth/callback/spotify`,
    },
  },

  session: {
    expiresIn: 30,
    disableSessionRefresh: true,
  },
});
