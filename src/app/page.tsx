"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import styles from "@/app/page.module.css";
import Image from "next/image";
import IndexNavigationBar from "@/components/IndexNavigationBar";
import SocialMediaLinks from "@/components/SocialMediaLinks";

export default function Index() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="flex flex-col">
      <div className="fixed top-0 left-0 z-100 w-full">
        <IndexNavigationBar scrollYProgress={scrollYProgress} />
      </div>
      <div className="relative h-[100svh] w-full overflow-hidden">
        <video autoPlay muted loop playsInline className={styles.videobg}>
          <source
            src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/videos/index-bg.webm`}
            type="video/webm"
          />
        </video>
      </div>
      <div className="min-h-dvh md:h-screen">
        <div className="flex flex-col md:flex-row items-start pt-16 sm:pt-24 md:pt-[30vh]">
          <div className="w-full px-[5vw] text-lg/[1.75rem] sm:text-xl/[2rem] md:h-full md:w-auto md:ml-[3vw] md:mr-auto md:px-0 md:pr-[10vh] md:text-[2rem]/[4rem]">
            I&apos;m passionate about building products that are both creative
            and useful, with a focus on clean and functional design that meets
            user needs.
          </div>
          <div className="w-full mt-8 px-[5vw] md:mt-0 md:h-full md:w-full md:px-0 md:mr-[3vw]">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/images/race-car.png`}
              width={888}
              height={188}
              alt="race-car"
              className="h-auto w-full"
            />
          </div>
        </div>
        <div className="mt-12 px-[5vw] sm:mt-16 md:mx-[3vw] md:mt-[28vh] md:px-0">
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
}
