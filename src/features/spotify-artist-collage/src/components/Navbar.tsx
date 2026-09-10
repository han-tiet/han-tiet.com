"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/features/spotify-artist-collage/src/components/ui/navigation-menu";
import LogOutButton from "@/features/spotify-artist-collage/src/components/LogOutButton";
import { ROUTES } from "@/constants/routes";

type NavbarProps = {
  user: string;
};

export function Navbar({ user }: NavbarProps) {
  return (
    <div className="col-span-full flex flex-col items-center gap-2 py-3 px-4 md:grid md:grid-cols-3 md:items-center md:h-[5vh] md:gap-0 md:py-0">
      <div className="hidden md:block" />
      <NavigationMenu className="md:justify-self-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN}
              className="text-center text-base sm:text-lg md:text-xl font-bold"
            >
              {user}&apos;s Spotify Artist Collage
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row gap-4 md:justify-self-end">
        <LogOutButton />
      </div>
    </div>
  );
}
