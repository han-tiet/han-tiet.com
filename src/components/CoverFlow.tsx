"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/app/projects/page.module.css";
import { useRef, useEffect } from "react";

export default function CoverFlow() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();

        const cardWidth = 2000;
        el.scrollLeft += e.deltaY > 0 ? cardWidth : -cardWidth;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <ul className={styles.cards}>
        <Link href="/gif-hunter">
          <li>
            <Image
              src="/images/gifhunter-screen.png"
              width={2000}
              height={1000}
              alt="gifhunter"
            />
          </li>
        </Link>
        <Link href="/">
          <li>
            <Image
              src="/images/spotify-artist-collage-screen.png"
              width={2000}
              height={1000}
              alt="spotify-artist-collage"
            />
          </li>
        </Link>
      </ul>
    </div>
  );
}
