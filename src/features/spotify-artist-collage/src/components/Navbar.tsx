"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/features/spotify-artist-collage/src/components/ui/navigation-menu";
import LogOutButton from "@/features/spotify-artist-collage/src/components/LogOutButton";

type NavbarProps = {
  user: string;
};

export function Navbar({ user }: NavbarProps) {
  return (
    <div className="col-span-full grid grid-cols-3 items-center h-[5vh] px-4">
      <div />
      <NavigationMenu className="justify-self-center">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className="text-center text-xl font-bold">
              {user}&apos;s Spotify Artist Collage
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row justify-self-end gap-4">
        <LogOutButton />
      </div>
    </div>
  );
}
