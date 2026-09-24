"use client";

import Image from "next/image";
import Link from "next/link";

export default function SocialMediaLinks() {
  return (
    <div className="flex flex-row gap-12 md:gap-16">
      <Link href="https://www.linkedin.com/in/han-tiet98/">
        <Image
          src="/linkedin.svg"
          width={48}
          height={48}
          alt="linkedin"
          className="size-8 md:size-12 desktop:size-16 [@media(max-height:500px)_and_(orientation:landscape)]:size-8"
        />
      </Link>
      <Link href="https://github.com/han-tiet">
        <Image
          src="/github.svg"
          width={48}
          height={48}
          alt="github"
          className="size-8 md:size-12 desktop:size-16 [@media(max-height:500px)_and_(orientation:landscape)]:size-8"
        />
      </Link>
    </div>
  );
}
