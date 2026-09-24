"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import styles from "@/app/page.module.css";
import Image from "next/image";
import IndexNavigationBar from "@/components/IndexNavigationBar";
import HeroScrollHint from "@/components/HeroScrollHint";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { CTAButton } from "@/components/CTAButton";

export default function Index() {
  const heroRef = useRef(null);

  // 0 while the hero fills the viewport, 1 once its bottom edge reaches the
  // top of the viewport.
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 left-0 z-100 w-full">
        <IndexNavigationBar heroScrollYProgress={heroScrollYProgress} />
      </div>
      <div ref={heroRef} className="relative h-[100svh] overflow-hidden">
        <video autoPlay muted loop playsInline className={styles.videobg}>
          <source
            src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/videos/index-bg.webm`}
            type="video/webm"
          />
        </video>
        <HeroScrollHint heroScrollYProgress={heroScrollYProgress} />
      </div>
      <div className="flex flex-col items-center min-h-dvh md:h-dvh md:gap-16 [@media(max-height:500px)_and_(orientation:landscape)]:h-dvh [@media(max-height:500px)_and_(orientation:landscape)]:overflow-y-auto [@media(max-height:500px)_and_(orientation:landscape)]:justify-center [@media(max-height:500px)_and_(orientation:landscape)]:gap-8">
        <div className="flex w-full justify-center pt-24 px-[5vw] md:pt-36 desktop:pt-[calc(14svh+2rem)] md:px-0 [@media(max-height:500px)_and_(orientation:landscape)]:pt-8 [@media(max-height:500px)_and_(orientation:landscape)]:max-w-44">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGEHOST}/images/profile.jpg`}
            width={649}
            height={757}
            alt="profile.jpg"
            className="h-auto w-48 md:w-64 tablet-landscape:w-48 desktop:w-60 rounded-full"
          />
        </div>
        <div className="pt-16 md:pt-2 [@media(max-height:500px)_and_(orientation:landscape)]:pt-2">
          <div className="w-full px-8 text-base/[2rem] md:w-auto md:text-[1.5rem]/[4rem] desktop:text-[2rem]/[4rem] desktop:px-16 tablet-landscape:text-[1.5rem]/[4rem] [@media(max-height:500px)_and_(orientation:landscape)]:text-base/[2rem]">
            I&apos;m passionate about building products that are both creative
            and useful, with a focus on clean and functional design that meets
            user needs.
          </div>
        </div>
        <div className="pt-16 px-[5vw] md:mx-[3vw] md:pt-0 desktop:pt-8 tablet-landscape:pt-0 [@media(max-height:500px)_and_(orientation:landscape)]:pt-0 [@media(max-height:500px)_and_(orientation:landscape)]:mx-0">
          <SocialMediaLinks />
          <CTAButton />
        </div>
      </div>
    </div>
  );
}
