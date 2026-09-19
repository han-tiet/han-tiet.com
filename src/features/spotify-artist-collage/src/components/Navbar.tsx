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
    // A phone on its side under 768px wide misses `md:grid` and falls back to
    // the stacked column, which costs height it hasn't got. The spacer stays
    // hidden there, so a row puts the title against the left edge and the
    // button against the right. The query carries its own `max-width` because
    // the bare short-landscape one sorts after `md:` and would otherwise also
    // hit wider landscape phones, which are on the grid and want to stay
    // there. Tablets need nothing: they clear 768px in landscape already.
    <div className="col-span-full flex flex-col items-center gap-2 desktop:gap-3 py-3 desktop:py-4.5 px-4 desktop:px-6 [@media(max-width:767px)_and_(max-height:500px)_and_(orientation:landscape)]:flex-row [@media(max-width:767px)_and_(max-height:500px)_and_(orientation:landscape)]:justify-between [@media(max-width:767px)_and_(max-height:500px)_and_(orientation:landscape)]:py-1 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:min-h-[5vh] md:gap-0 md:py-0">
      <div className="hidden md:block" />
      {/* `max-w-full` overrides the menu root's own `max-w-max`, which pins it
          to max-content and stops the title ever wrapping, overflowing a narrow
          phone. It can wrap now, so the bar's middle column is `auto` rather
          than a rigid third: the title takes the width it needs and the two
          `1fr` sides split what is left, which keeps it centred and on one
          line until the bar genuinely runs out of room. */}
      <NavigationMenu className="max-w-full md:justify-self-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href={ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN}
              className="text-center text-base sm:text-lg md:text-xl desktop:text-3xl font-bold"
            >
              {user}&apos;s Spotify Artist Collage
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row gap-4 desktop:gap-6 md:justify-self-end">
        <LogOutButton />
      </div>
    </div>
  );
}
