import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  basePath: "/projects/spotify-artist-collage/api/auth", // URL of index page
});
