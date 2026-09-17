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
  // vw term hits 0 at the end, so clamp() falls back to --title-size:
  // 24px, or 48px from md up (back to 24px on handheld) —
  // NavigationBar's exact sizes.
  const titleVw = useTransform(heroScrollYProgress, [0, 0.5], [20, 0]);
  const titleFontSize = useMotionTemplate`clamp(var(--title-size), ${titleVw}vw, 25rem)`;

  const titleLeadingVw = useTransform(heroScrollYProgress, [0, 0.5], [24, 0]);
  const titleLineHeight = useMotionTemplate`clamp(60px, ${titleLeadingVw}vw, 30rem)`;

  // Centre of the viewport -> the nav bar's left padding (px-[3vw]), plus
  // --title-inset once fully shrunk so the text lands level with the burger
  // icon's inset inside its 52px tap target.
  const leftVw = useTransform(heroScrollYProgress, [0, 0.5], [50, 3]);
  const leftInset = useTransform(heroScrollYProgress, [0, 0.5], [0, 1]);
  const left = useMotionTemplate`calc(${leftVw}vw + ${leftInset} * var(--title-inset))`;

  // Centre of the viewport -> vertically centred in the h-[14vh] bar:
  // half the bar (7vh) minus half the 60px line box.
  const topVh = useTransform(heroScrollYProgress, [0, 0.5], [50, 7]);
  const topPx = useTransform(heroScrollYProgress, [0, 0.5], [0, -30]);
  const top = useMotionTemplate`calc(${topVh}vh + ${topPx}px)`;

  // Anchored by its own centre at the start, by its top-left at the end.
  const shiftPct = useTransform(heroScrollYProgress, [0, 0.5], [50, 0]);
  const transform = useMotionTemplate`translate(-${shiftPct}%, -${shiftPct}%)`;

  const titleColor = useTransform(
    heroScrollYProgress,
    [0, 0.5],
    ["#F0F0F0", "#000000"],
  );
  const titlePointerEvents = useTransform(
    heroScrollYProgress,
    [0.49, 0.5],
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
    <div className="col-span-full grid grid-cols-2 items-center h-[14vh] px-[3vw]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            {/* Reserves the box NavigationBar's title occupies, so the
                fixed copy has something to land on. */}
            <span
              aria-hidden
              className="invisible text-[24px]/[60px] md:text-[48px]/[60px] handheld:text-[24px]/[60px] font-semibold ps-[12px] md:ps-0 handheld:ps-[12px]"
            >
              {TITLE}
            </span>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <motion.a
        href={ROUTES.INDEX}
        className="fixed z-100 whitespace-nowrap font-semibold [--title-size:24px] md:[--title-size:48px] handheld:[--title-size:24px] [--title-inset:12px] md:[--title-inset:0px] handheld:[--title-inset:12px]"
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
