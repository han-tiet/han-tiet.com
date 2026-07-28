"use client";

import Image from "next/image";
import Link from "next/link";

export type ProjectProps = {
  name: string;
  description: string;
  href: string;
  src: string;
};

export function Project(project: ProjectProps) {
  return (
    <>
      <div className="flex flex-col items-center">
        <Link href={project.href}>
          <Image
            src={project.src}
            width={2000}
            height={1000}
            alt={project.name}
          />
        </Link>
      </div>
    </>
  );
}
