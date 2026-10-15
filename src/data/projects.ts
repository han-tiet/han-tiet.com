import { ROUTES } from "@/constants/routes";

export type Project = {
  slug: string;
  name: string;
  what: string;
  why: string;
  hardBit: string;
  stack: string[];
  href: string;
  src: string;
  alt: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "gif-hunter",
    name: "GIFHunter",
    what: "A GIF search engine that fetches from multiple APIs",
    why: "Built to learn how to fetch data from external APIs",
    hardBit:
      "Main Challenge: Making the fetch logic return the results from one API while the other API cannot be accessed",
    stack: ["Next.js", "MaterialUI", "Fetch"],
    href: ROUTES.GIFHUNTER_INDEX,
    src: `${process.env.NEXT_PUBLIC_IMAGEHOST}/images/gifhunter-screen.png`,
    alt: "Results from searching 'cat' on GIFhunter",
  },
  {
    slug: "spotify-artist-collage",
    name: "Spotify Artist Collage",
    what: "A website that collages the user's top 50 most listened to artists on Spotify",
    why: "Built to learn how to implement OAuth in a website",
    hardBit:
      "Main Challenge: Configuring authentication with Better Auth and Spotify's API",
    stack: ["Next.js", "Better Auth", "Prisma", "CSS Animations"],
    href: ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN,
    src: `${process.env.NEXT_PUBLIC_IMAGEHOST}/images/spotify-artist-collage-screen.png`,
    alt: "A collage of a test account's most listened to artists",
  },
];
