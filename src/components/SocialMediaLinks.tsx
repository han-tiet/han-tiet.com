"use client";

import Image from "next/image";
import Link from "next/link";

export default function SocialMediaLinks() {
  return (
    <div className="flex flex-row mx-[50px] my-[260px] gap-[68px]">
      <Link href="https://www.linkedin.com/in/han-tiet98/">
        <Image src="/linkedin.svg" width={48} height={48} alt="linkedin" />
      </Link>
      <Link href="https://github.com/han-tiet">
        <Image src="/github.svg" width={48} height={48} alt="github" />
      </Link>
      <Link href="mailto:hanweitiet@gmail.com">
        <Image src="/envelope-alt.svg" width={48} height={48} alt="email" />
      </Link>
    </div>
  );
}
