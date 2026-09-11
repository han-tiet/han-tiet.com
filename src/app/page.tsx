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
      <div className="flex flex-col items-center min-h-dvh pt-40 md:h-dvh md:justify-between md:gap-8 [@media(max-height:500px)_and_(orientation:landscape)]:h-dvh [@media(max-height:500px)_and_(orientation:landscape)]:overflow-y-auto [@media(max-height:500px)_and_(orientation:landscape)]:justify-center [@media(max-height:500px)_and_(orientation:landscape)]:gap-8 [@media(max-height:500px)_and_(orientation:landscape)]:py-[3vh]">
        <div className="flex w-full justify-center mt-8 px-[5vw] md:mt-0 md:w-full md:px-0 [@media(max-height:500px)_and_(orientation:landscape)]:mt-8 [@media(max-height:500px)_and_(orientation:landscape)]:max-w-55">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/images/profile.jpg`}
            width={888}
            height={188}
            alt="profile.jpg"
            className="h-auto w-48 md:w-64 rounded-full"
          />
        </div>
        <div className="flex flex-col md:flex-row items-start pt-16 sm:pt-24 md:pt-2 [@media(max-height:500px)_and_(orientation:landscape)]:pt-2">
          <div className="w-full px-[5vw] text-lg/[1.75rem] sm:text-xl/[2rem] md:h-full md:w-auto md:mx-2 md:text-[2rem]/[4rem] [@media(max-height:500px)_and_(orientation:landscape)]:text-base/[1.4rem]">
            I&apos;m passionate about building products that are both creative
            and useful, with a focus on clean and functional design that meets
            user needs.
          </div>
        </div>
        <div className="pt-24 px-[5vw] sm:mt-16 md:mx-[3vw] md:mt-0 md:px-0 md:pt-0 [@media(max-height:500px)_and_(orientation:landscape)]:pt-0 [@media(max-height:500px)_and_(orientation:landscape)]:mt-2 [@media(max-height:500px)_and_(orientation:landscape)]:mx-0">
          <SocialMediaLinks />
        </div>
      </div>
    </div>
  );
}
