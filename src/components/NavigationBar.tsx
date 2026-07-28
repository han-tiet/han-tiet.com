"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import NavButton from "@/components/NavButton";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NavigationBar() {
  return (
    <div className="col-span-full grid grid-cols-2 items-center h-[14vh] px-[3vw]">
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
        <NavButton href={ROUTES.PROJECTS}>Projects</NavButton>
        <NavButton href={ROUTES.CONTACT}>Contact</NavButton>
      </div>
    </div>
  );
}
