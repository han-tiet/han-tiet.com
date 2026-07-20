"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/features/spotify-artist-collage/src/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function LogInButton() {
  const LogIn = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL: ROUTES.SPOTIFY_ARTIST_COLLAGE__INDEX,
    });
  };

  return (
    <Button variant="secondary" className="w-auto" onClick={LogIn}>
      Log In With Spotify
    </Button>
  );
}
