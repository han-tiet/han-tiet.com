"use client";

import { useState } from "react";
import {
  motion,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import NavButton from "@/components/NavButton";
import MobileNav from "@/components/MobileNav";
import { ROUTES } from "@/constants/routes";

const TITLE = "Han Tiet";

export default function IndexNavigationBar({
  heroScrollYProgress,
}: {
  heroScrollYProgress: MotionValue<number>;
}) {
  // Title size: vw term hits 0 at the end, so clamp() falls back to --title-size:
  // 1.5rem, or 3rem from md up (back to 1.5rem on handheld) —
  const titleVw = useTransform(heroScrollYProgress, [0, 0.5], [20, 0]);
  const titleFontSize = useMotionTemplate`clamp(var(--title-size), ${titleVw}vw, 25rem)`;

  const titleLeadingVw = useTransform(heroScrollYProgress, [0, 0.5], [24, 0]);
  const titleLineHeight = useMotionTemplate`clamp(3.75rem, ${titleLeadingVw}vw, 30rem)`;

  // Title distance from left: Centre of the viewport -> the nav bar's left padding (px-[3vw]), plus
  // --title-inset once fully shrunk so the text lands level with the burger
  // icon's inset inside its 52px tap target.
  const leftVw = useTransform(heroScrollYProgress, [0, 0.5], [50, 3]);
  const leftInset = useTransform(heroScrollYProgress, [0, 0.5], [0, 1]);
  const left = useMotionTemplate`calc(${leftVw}vw + ${leftInset} * var(--title-inset))`;

  // Title distance from top: Centre of the viewport -> vertically centred in the h-[14svh] bar:
  // half the bar (7svh) minus half the 3.75rem line box.
  const topSvh = useTransform(heroScrollYProgress, [0, 0.5], [50, 7]);
  const topRem = useTransform(heroScrollYProgress, [0, 0.5], [0, -1.875]);
  const top = useMotionTemplate`calc(${topSvh}svh + ${topRem}rem)`;

  // Centre position of title: Anchored by its own centre at the start, by its top-left at the end.
  const shiftPct = useTransform(heroScrollYProgress, [0, 0.5], [50, 0]);
  const transform = useMotionTemplate`translate(-${shiftPct}%, -${shiftPct}%)`;

  const titleColor = useTransform(
    heroScrollYProgress,
    [0, 0.5],
    ["#F0F0F0", "#000000"],
  );
  const titlePointerEvents = useTransform(
    heroScrollYProgress,
    [0, 0.5],
    ["none", "auto"],
  );

  // Hidden until the bottom of the hero section clears the top of the
  // viewport, then visible for the rest of the page.
  const navOpacity = useTransform(heroScrollYProgress, [0.99, 1], [0, 1]);
  const navPointerEvents = useTransform(
    heroScrollYProgress,
    [0.99, 1],
    ["none", "auto"],
  );

  const [navReady, setNavReady] = useState(false);
  useMotionValueEvent(heroScrollYProgress, "change", (v) =>
    setNavReady(v >= 0.99),
  );

  return (
    <div className="col-span-full grid grid-cols-2 items-center h-[14svh] px-[3vw]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {/* Reserves the box NavigationBar's title occupies, so the
                fixed copy has something to land on. */}
            <span
              aria-hidden
              className="invisible text-[1.5rem]/[3.75rem] md:text-[3rem]/[3.75rem] handheld:text-[1.5rem]/[3.75rem] font-semibold ps-[12px] md:ps-0 handheld:ps-[12px]"
            >
              {TITLE}
            </span>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <motion.a
        href={ROUTES.INDEX}
        className="fixed z-100 whitespace-nowrap font-semibold [--title-size:1.5rem] md:[--title-size:3rem] handheld:[--title-size:1.5rem] [--title-inset:12px] md:[--title-inset:0px] handheld:[--title-inset:12px]"
        style={{
          top,
          left,
          transform,
          fontSize: titleFontSize,
          lineHeight: titleLineHeight,
          color: titleColor,
          pointerEvents: titlePointerEvents,
        }}
      >
        {TITLE}
      </motion.a>

      <motion.div
        inert={!navReady}
        className="justify-self-end"
        style={{ opacity: navOpacity, pointerEvents: navPointerEvents }}
      >
        <div className="hidden flex-row gap-4 md:flex touch:hidden">
          <NavButton href={ROUTES.PROJECTS}>Projects</NavButton>
          <NavButton href={ROUTES.CONTACT}>Contact</NavButton>
        </div>
        <MobileNav />
      </motion.div>
    </div>
  );
}
