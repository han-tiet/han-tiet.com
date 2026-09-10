// src/components/ProjectCarousel.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "framer-motion";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";

/**
 * Native scroll-snap carousel.
 *
 * Touch scrolling is left entirely to the browser. Dot and arrow navigation
 * drives scrollLeft with a Framer spring instead of `behavior: "smooth"`, so a
 * tap settles with the same overshoot-and-recover feel as releasing a drag.
 */

const CARD_WIDTH = "min(84vw, 440px)";

// How far the cards trail behind the scroll, in px. Small on purpose: this
// should read as weight, not as a slide.
const DRAG_LAG = 0;

const scrollerStyle = {
  "--card-w": CARD_WIDTH,
  paddingInline: "calc(50% - var(--card-w) / 2)",
} as React.CSSProperties;

export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const scrollerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const scrollAnimation = useRef<AnimationPlaybackControls | null>(null);
  const [active, setActive] = useState(0);
  const [showHint, setShowHint] = useState(true);
  // -1, 0 or 1. Non-zero while a spring is running, which pulls the cards
  // against the direction of travel and lets them settle back to 0.
  const [lag, setLag] = useState(0);
  const reduceMotion = false;

  // Track the centred card with an IntersectionObserver rather than a scroll
  // listener. The callback only fires when a card crosses the middle 10% of the
  // scroller, so no measuring happens per frame.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { root, rootMargin: "0px -45% 0px -45%", threshold: 0 },
    );

    for (const el of itemRefs.current) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [projects.length]);

  // Drop the desktop hint on the first scroll, then stop listening.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const onScroll = () => setShowHint(false);
    root.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, []);

  const stopScrollAnimation = useCallback(() => {
    scrollAnimation.current?.stop();
    scrollAnimation.current = null;

    const root = scrollerRef.current;
    // Hand snapping back to the browser. Wherever we stopped, it settles onto
    // the nearest card by itself.
    if (root) root.style.scrollSnapType = "";
    setLag(0);
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const root = scrollerRef.current;
      const item = itemRefs.current[index];
      if (!root || !item) return;

      setShowHint(false);
      stopScrollAnimation();

      const target =
        item.offsetLeft - (root.clientWidth - item.clientWidth) / 2;

      if (reduceMotion) {
        root.scrollLeft = target;
        return;
      }

      const direction = Math.sign(target - root.scrollLeft);
      if (direction === 0) return;

      setLag(direction);

      // Mandatory snapping re-centres the scroller on every scrollLeft write,
      // which kills the spring mid-flight. Suspend it while we drive the scroll.
      root.style.scrollSnapType = "none";

      scrollAnimation.current = animate(root.scrollLeft, target, {
        type: "spring",
        stiffness: 210,
        damping: 26,
        mass: 1,
        restDelta: 0.5,
        onUpdate: (value) => {
          root.scrollLeft = value;
        },
        onComplete: () => {
          root.style.scrollSnapType = "";
          scrollAnimation.current = null;
          setLag(0);
        },
      });
    },
    [reduceMotion, stopScrollAnimation],
  );

  // A touch or click on the carousel takes priority over an in-flight spring.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    root.addEventListener("pointerdown", stopScrollAnimation, {
      passive: true,
    });
    return () => root.removeEventListener("pointerdown", stopScrollAnimation);
  }, [stopScrollAnimation]);

  // Stop the spring if the component unmounts mid-animation.
  useEffect(() => () => scrollAnimation.current?.stop(), []);

  // Map vertical wheel input onto horizontal movement. Steps one card at a time
  // because snap-mandatory fights incremental scrollBy calls.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    let locked = false;

    const onWheel = (event: WheelEvent) => {
      // Trackpad horizontal swipes are already correct — leave them alone.
      if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      if (root.scrollWidth <= root.clientWidth) return;

      // At either end, release the wheel back to the page.
      const atLeft = root.scrollLeft <= 1;
      const atRight =
        root.scrollLeft + root.clientWidth >= root.scrollWidth - 1;
      if ((atLeft && event.deltaY < 0) || (atRight && event.deltaY > 0)) return;

      event.preventDefault();
      if (locked) return;

      locked = true;
      setTimeout(() => (locked = false), 350);
      scrollToIndex(active + (event.deltaY > 0 ? 1 : -1));
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [active, scrollToIndex]);

  const atStart = active === 0;
  const atEnd = active === projects.length - 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Projects"
      className="relative w-full"
    >
      <ul
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollToIndex(Math.min(active + 1, projects.length - 1));
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollToIndex(Math.max(active - 1, 0));
          }
        }}
        style={scrollerStyle}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain py-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:gap-8"
      >
        {projects.map((project, index) => {
          const isActive = index === active;

          return (
            <motion.li
              key={project.slug}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-index={index}
              style={{ width: "var(--card-w)" }}
              className="flex shrink-0 snap-center"
              animate={
                reduceMotion
                  ? { scale: 1, opacity: 1, x: 0 }
                  : {
                      scale: isActive ? 1 : 0.9,
                      opacity: isActive ? 1 : 0.55,
                      // The centred card resists hardest; its neighbours trail
                      // less, which reads as the row having weight.
                      x: lag * DRAG_LAG * (isActive ? 1 : 0.5),
                    }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.7,
              }}
            >
              <ProjectCard project={project} priority={index === 0} />
            </motion.li>
          );
        })}
      </ul>

      {/* Desktop arrows. Hidden from assistive tech because the list is already
          keyboard scrollable and the dots below reach every project. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => scrollToIndex(active - 1)}
        disabled={atStart}
        className="absolute top-1/2 left-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-opacity active:scale-95 disabled:opacity-0 md:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => scrollToIndex(active + 1)}
        disabled={atEnd}
        className="absolute top-1/2 right-4 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur transition-opacity active:scale-95 disabled:opacity-0 md:flex"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="flex flex-col gap-16">
        <div className="mt-4 flex justify-center gap-1">
          {projects.map((project, index) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Show ${project.name}`}
              aria-current={index === active}
              className="p-2"
            >
              <motion.span
                className="block size-2 rounded-full bg-foreground"
                animate={{
                  scale: index === active ? 1.4 : 1,
                  opacity: index === active ? 1 : 0.3,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
              />
            </button>
          ))}
        </div>
        {/* Scroll hint: desktop only, removed after the first scroll so the
            looping animation stops running. */}
        <div>
          <AnimatePresence>
            {showHint && projects.length > 1 && (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center justify-center gap-2 text-sm text-muted-foreground md:flex"
              >
                <motion.span
                  animate={reduceMotion ? undefined : { x: [-4, 4, -4] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <MoveHorizontal className="size-4" />
                </motion.span>
                Scroll to see more projects
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
