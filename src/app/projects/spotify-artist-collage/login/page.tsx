"use client";

import LogInButton from "@/features/spotify-artist-collage/src/components/LogInButton";

export default function LoginPage() {
  return (
    <div className="grid grid-col-12 h-[90vh]">
      <div className="flex flex-col justify-center items-center gap-8">
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-7xl font-bold">Spotify Artist Collage</div>
          <div className="text-lg">
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
