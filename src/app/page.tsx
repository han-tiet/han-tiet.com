"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "@/app/page.module.css";
import Image from "next/image";
import IndexNavigationBar from "@/components/IndexNavigationBar";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { CTAButton } from "@/components/CTAButton";

export default function Index() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleFontSize = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["25rem", "3rem"],
  );

  const titleX = useTransform(scrollYProgress, [0, 0.5], ["3vw", "3vw"]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], ["4vh", "4vh"]);
  const titleColor = useTransform(
    scrollYProgress,
    [0, 0.5],
    ["#FAFAFA", "#000000"],
  );
  const titlePointerEvents = useTransform(
    scrollYProgress,
    [0.49, 0.5],
    ["none", "auto"],
  );

  const navBarOpacity = useTransform(scrollYProgress, [0.99, 1], [0, 1]);
  const navBarPointerEvents = useTransform(
    scrollYProgress,
    [0.5, 1],
    ["none", "auto"],
  );

  return (
    <div ref={containerRef}>
      <motion.div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          opacity: navBarOpacity,
          pointerEvents: navBarPointerEvents,
        }}
      >
        <IndexNavigationBar />
      </motion.div>
      <motion.a
        href="/"
        className="font-semibold z-100"
        style={{
          fontSize: titleFontSize,
          color: titleColor,
          position: "sticky",
          top: titleY,
          left: titleX,
          pointerEvents: titlePointerEvents,
          overflow: "nowrap",
        }}
      >
        Han Tiet
      </motion.a>
      <div className="h-[100vh] w-[100vw] overflow-hidden">
        <video autoPlay muted loop playsInline className={styles.videobg}>
          <source
            src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/videos/index-bg.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
      <div className="h-[100vh]">
        <div className="flex flex-row items-left pt-[30vh]">
          <div className="text-[2rem]/[4rem] h-full w-full ml-[3vw] mr-auto pr-[10vh]">
            I&apos;m passionate about building products that are both creative
            and useful, with a focus on clean and functional design that meets
            user needs.
          </div>
          <div className="w-full h-full mr-[3vw]]">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/images/race-car.png`}
              width={888}
              height={188}
              alt="race-car"
            />
          </div>
        </div>
        <div className="flex justify-between mx-[3vw] mt-[28vh]">
          <SocialMediaLinks />
          <CTAButton />
        </div>
      </div>
    </div>
  );
}
