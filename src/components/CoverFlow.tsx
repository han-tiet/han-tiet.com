"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "@/app/projects/page.module.css";

export default function CoverFlow() {
  return (
    <div className={styles.container}>
      <ul className={styles.cards}>
        <Link href="/gifhunter">
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
