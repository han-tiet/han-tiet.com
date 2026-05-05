"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "@/app/page.module.css";
import Image from "next/image";
import NavigationBar from "@/components/NavigationBar";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { title } from "process";

export default function Index() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const initialFontSize = 400;

  const titleFontSize = useTransform(
    scrollYProgress,
    [0, 0.5],
    [`${initialFontSize}px`, "48px"],
  );

  const heroTitleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const aboutTitleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <div ref={containerRef} className="h-[200vh]">
      <motion.span
        className="font-semibold text-gray-200 z-100"
        style={{
          fontSize: titleFontSize,
          position: "sticky",
          top: "40px",
          left: "50px",
          whiteSpace: "nowrap",
          opacity: heroTitleOpacity,
        }}
      >
        Han Tiet
      </motion.span>
      <div className="h-[100vh] w-[100vw] overflow-hidden">
        <video autoPlay muted loop playsInline className={styles.videobg}>
          <source
            src={`${process.env.NEXT_PUBLIC_HOST}/videos/index-bg.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
      <div className="h-[100vh] -z-1">
        <NavigationBar />
        <div className="flex flex-row items-left mt-[160px]">
          <div className="text-[32px]/[64px] h-[192px] w-[896px] ml-[50px] mr-auto">
            I’m passionate about building products that are both creative and
            useful, with a focus on clean and functional design that meets user
            needs.
          </div>
          <div className="w-[888px] h-[188px] mr-[50px]">
            <Image
              src="/photos/race-car.png"
              width={888}
              height={188}
              alt="race-car"
            />
          </div>
        </div>
        <div className="mx-[50px] mt-[260px]">
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
}
