"use client";

import LogInButton from "@/features/spotify-artist-collage/src/components/LogInButton";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  return (
    <div className="grid grid-col-12">
      <div className="flex justify-start items-center min-h-[4rem] px-4 text-sm md:text-lg desktop:text-xl hover:text-primary">
        <a href={ROUTES.PROJECTS}>&lt;&lt; Projects</a>
      </div>
      <div className="flex flex-col justify-center items-center gap-8 px-6 pt-36 md:pt-68 [@media(max-height:500px)_and_(orientation:landscape)]:pt-16 desktop:gap-12 desktop:px-9 desktop:pt-108 text-center">
        <div className="flex flex-col justify-center items-center gap-4 desktop:gap-6">
          <div className="text-3xl md:text-6xl desktop:text-[6.75rem] font-bold">
            Spotify Artist Collage
          </div>
          <div className="text-base sm:text-lg desktop:text-[1.75rem]">
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
