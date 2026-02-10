"use client";

import styles from "@/app/page.module.css";

export default function Index() {
  return (
    <div className={styles.videoWrapper}>
      <video autoPlay muted loop playsInline className={styles.videobg}>
        <source src="/videos/index-bg.mp4" type="video/mp4" />
      </video>

      <div className="flex justify-center items-center h-full w-full bg-black/40">
        <div className="text-[256px] font-semibold text-gray-200">Han Tiet</div>
      </div>
    </div>
  );
}
