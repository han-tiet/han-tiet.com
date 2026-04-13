import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  basePath: "/projects/spotify-artist-collage/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    "https://192.168.50.121:3000",
    "https://spotify-artist-collage-git-collage-013-han-tiets-projects.vercel.app",
  ], // Added index to trusted origins to remove NextJS warning

  socialProviders: {
    // Add provider for Spotify OAuth login page
    spotify: {
      clientId: process.env.SPOTIFY_ID as string,
      clientSecret: process.env.SPOTIFY_SECRET as string,
      scope: ["user-top-read", "user-read-recently-played"],
      redirectURI: `${process.env.BETTER_AUTH_URL}/projects/spotify-artist-collage/api/auth/callback/spotify`,
    },
  },

  session: {
    expiresIn: 30,
    disableSessionRefresh: true,
  },
});
