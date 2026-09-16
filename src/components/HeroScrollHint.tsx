"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * "Scroll down for more" hint pinned near the bottom of the hero.
 *
 * Driven by the hero's own scroll progress rather than a scroll listener, so
 * it shares the single motion value the index page already creates. It is gone
 * well before the hero clears the viewport, which also stops the looping
 * chevron animation running under the rest of the page.
 */
export default function HeroScrollHint({
  heroScrollYProgress,
}: {
  heroScrollYProgress: MotionValue<number>;
}) {
  const reduceMotion = useReducedMotion();

  const opacity = useTransform(heroScrollYProgress, [0, 0.8], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      // #FAFAFA is the colour the title starts at over this video.
      className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center justify-center gap-2 desktop:gap-4 text-[#FAFAFA] text-sm md:text-base desktop:text-[1.75rem] [@media(max-height:500px)_and_(orientation:landscape)]:bottom-3 [@media(max-height:500px)_and_(orientation:landscape)]:gap-1"
    >
      Scroll down for more
      <motion.span
        animate={reduceMotion ? undefined : { y: [-4, 4, -4] }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="size-4 md:size-5 desktop:size-8" />
      </motion.span>
    </motion.div>
  );
}
