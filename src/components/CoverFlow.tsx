"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/app/projects/page.module.css";
import { useRef, useEffect, useState } from "react";

export default function CoverFlow() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();

        const cardWidth = 2000;
        el.scrollLeft += e.deltaY > 0 ? cardWidth : -cardWidth;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <ul className={styles.cards}>
        <Link href="/gif-hunter">
          <li>
            <div>
              <div id="title" className={styles.title}>
                <div className="text-xl">GIFHunter - A GIF Search Engine</div>
                <Image
                  src="/github.svg"
                  width={24}
                  height={24}
                  alt="github-link"
                />
              </div>
              <Image
                src="/images/gifhunter-screen.png"
                width={2000}
                height={1000}
                alt="gifhunter"
              />
              <div id="tech-used" className={styles.techUsed}>
                <div className="text-md py-2">Technologies Used</div>
                <div className="text-sm">NextJS</div>
                <div className="text-sm">Typescript</div>
                <div className="text-sm">Fetch API</div>
              </div>
            </div>
          </li>
        </Link>
        <Link href="/">
          <li>
            <div>
              <div id="title" className={styles.title}>
                <div className="text-xl">
                  Spotify Artist Collage - Your Top 50 Artists
                </div>
                <Image
                  src="/github.svg"
                  width={24}
                  height={24}
                  alt="github-link"
                />
              </div>
              <Image
                src="/images/spotify-artist-collage-screen.png"
                width={2000}
                height={1000}
                alt="spotify-artist-collage"
              />
              <div id="tech-used" className={styles.techUsed}>
                <div className="text-md py-2">Technologies Used</div>
                <div className="text-sm">CSS Animations</div>
                <div className="text-sm">OAuth</div>
                <div className="text-sm">Server Actions</div>
                <div className="text-sm">PostgresDB</div>
              </div>
            </div>
          </li>
        </Link>
      </ul>
    </div>
  );
}
