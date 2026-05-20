import { createAuthClient } from "better-auth/react";
import { ROUTES } from "@/constants/routes";

export const authClient = createAuthClient({
  basePath: ROUTES.SPOTIFY_ARTIST_COLLAGE__AUTH_API, // URL of index page
});
