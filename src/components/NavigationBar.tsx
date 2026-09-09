"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import NavButton from "@/components/NavButton";
import MobileNav from "@/components/MobileNav";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NavigationBar() {
  return (
    <div className="col-span-full grid grid-cols-2 items-center h-[14svh] px-[3vw]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              href="/"
              className="text-[24px]/[60px] md:text-[48px]/[60px] font-semibold"
            >
              Han Tiet
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="justify-self-end">
        <div className="hidden flex-row gap-4 md:flex">
          <NavButton href={ROUTES.PROJECTS}>Projects</NavButton>
          <NavButton href={ROUTES.CONTACT}>Contact</NavButton>
        </div>
        <MobileNav />
      </div>
    </div>
  );
}
