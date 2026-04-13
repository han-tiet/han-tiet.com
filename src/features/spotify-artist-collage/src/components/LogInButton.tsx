"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/features/spotify-artist-collage/src/components/ui/button";

export default function LogInButton() {
  const LogIn = async () => {
    await authClient.signIn.social({
      provider: "spotify",
      callbackURL:"/projects/spotify-artist-collage"
    });
  };

  return (
    <Button className="w-auto" onClick={LogIn}>
      Log In With Spotify
    </Button>
  );
}
