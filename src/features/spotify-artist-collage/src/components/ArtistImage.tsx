"use client";

import Image from "next/image";
import Link from "next/link";

export type ArtistImageProps = {
  id: string;
  images: [{ url: string }];
  name: string;
  ranking: number;
};

export function ArtistImage({ id, name, images, ranking }: ArtistImageProps) {
  return (
    <Link href={`spotify:artist:${id}`}>
      <div className="relative w-auto h-auto group">
        <div className="overflow-hidden" style={{ width: 120, height: 120 }}>
          <Image
            className="w-full h-full object-cover" /* Image expands to div w and h */
            src={images[0].url}
            alt={name}
            width={120}
            height={120}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 text-gray-300 text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div>{ranking}</div>
          <div>{name}</div>
        </div>
      </div>
    </Link>
  );
}
