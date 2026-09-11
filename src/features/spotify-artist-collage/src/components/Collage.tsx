"use client";

import {
  ArtistImage,
  ArtistImageProps,
} from "@/features/spotify-artist-collage/src/components/ArtistImage";

type CollageProps = {
  data: [];
};

export function Collage({ data }: CollageProps) {
  return (
    // 13 columns on short landscape screens puts all 50 artists in 4 rows,
    // which fits on a phone on its side.
    <div className="grid w-full max-w-300 grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 [@media(max-height:500px)_and_(orientation:landscape)]:grid-cols-13">
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
