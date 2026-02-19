"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavButton from "./NavButton";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <div className="col-span-full grid grid-cols-2 items-center h-[140px] px-[50px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" className="text-[48px]/[60px] font-semibold">
              Han Tiet
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row justify-self-end gap-4">
        <NavButton href="/about">About</NavButton>
        <NavButton href="/projects">Projects</NavButton>
        <NavButton href="/contact">Contact</NavButton>
      </div>
    </div>
  );
}
