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
    //
    // On desktop the 50 artists are 10 columns by 5 rows, and the tiles are
    // square, so the limit is height rather than width: five rows have to fit
    // the wrapper's `md:min-h-[85vh]` less its `desktop:py-12` (96px). That
    // gives a tile of `(85vh - 96px) / 5`, hence a grid of ten of those —
    // `170vh - 192px`. Below that the grid is width-limited and the cap idles.
    <div className="grid w-full max-w-300 desktop:max-w-[calc(170vh-192px)] grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 desktop:grid-cols-10 [@media(max-height:500px)_and_(orientation:landscape)]:grid-cols-13">
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
