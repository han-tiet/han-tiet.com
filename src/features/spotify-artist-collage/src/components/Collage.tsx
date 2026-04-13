"use client";

import { ArtistImage, ArtistImageProps } from "@/features/spotify-artist-collage/src/components/ArtistImage";

type CollageProps = {
  data: [];
};

export function Collage({ data }: CollageProps) {
  return (
    <div className="grid grid-cols-10">
      {data.map((artist: ArtistImageProps, i) => (
        <div
          key={artist.id}
          className="opacity-0 animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <ArtistImage
            id={artist.id}
            name={artist.name}
            images={artist.images}
            ranking={i + 1} // Index of a mapped element can be included as function param
          />
        </div>
      ))}
    </div>
  );
}
