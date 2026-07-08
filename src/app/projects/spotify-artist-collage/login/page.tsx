"use client";

import LogInButton from "@/features/spotify-artist-collage/src/components/LogInButton";

export default function LoginPage() {
  return (
    <div className="grid grid-col-12 h-[65vh]">
      <div className="flex justify-start items-center h-[5vh] px-[1vw] hover:text-primary">
        <a href={`${process.env.NEXT_PUBLIC_TLD}` || ""}>&lt;&lt; Projects</a>
      </div>
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
