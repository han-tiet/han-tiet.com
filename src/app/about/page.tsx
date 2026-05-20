"use client";

import Image from "next/image";
import NavigationBar from "@/components/NavigationBar";
import SocialMediaLinks from "@/components/SocialMediaLinks";

export default function About() {
  return (
    <div>
      <NavigationBar />
      <div className="flex flex-row items-center mt-[160px]">
        <div className="text-[32px]/[64px] h-[192px] w-[896px] ml-[50px] mr-auto">
          I’m passionate about building products that are both creative and
          useful, with a focus on clean and functional design that meets user
          needs.
        </div>
        <div className="w-[888px] h-[188px] mr-[50px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_HOST}/images/race-car.png`}
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
  );
}
