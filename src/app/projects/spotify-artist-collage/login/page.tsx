"use client";

import LogInButton from "@/features/spotify-artist-collage/src/components/LogInButton";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <div className="grid grid-col-12 min-h-[65vh]">
      <div className="flex justify-start items-center h-[5vh] px-4 hover:text-primary">
        <a href={ROUTES.PROJECTS}>&lt;&lt; Projects</a>
      </div>
      <div className="flex flex-col justify-center items-center gap-8 px-6 py-12 text-center">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-3xl sm:text-5xl md:text-7xl font-bold">
            Spotify Artist Collage
          </div>
          <div className="text-base sm:text-lg">
            Your favourite artists, like you&apos;ve never seen them before
          </div>
        </div>
        <div className="mx-auto">
          <LogInButton />
        </div>
      </div>
    </div>
  );
}
