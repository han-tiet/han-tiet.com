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
    <div className="col-span-full grid grid-cols-2 items-center min-h-[14svh] px-[3vw]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {/* ps-[12px] matches the burger icon's inset inside its 52px
                tap target, so both sit the same distance from the edge. */}
            <Link
              href="/"
              className="text-[1.5rem]/[3.75rem] md:text-[3rem]/[3.75rem] handheld:text-[1.5rem]/[3.75rem] font-semibold ps-[12px] md:ps-0 handheld:ps-[12px]"
            >
              Han Tiet
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="justify-self-end">
        <div className="hidden flex-row gap-4 md:flex touch:hidden">
          <NavButton href={ROUTES.PROJECTS}>Projects</NavButton>
          <NavButton href={ROUTES.CONTACT}>Contact</NavButton>
        </div>
        <MobileNav />
      </div>
    </div>
  );
}
