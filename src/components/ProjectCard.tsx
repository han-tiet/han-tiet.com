// src/components/ProjectCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    // On short landscape screens (phones on their side) the stacked card is
    // taller than the viewport, so it switches to image-left, text-right.
    <article className="flex h-full w-full flex-col items-center gap-4 desktop:gap-8 rounded-lg desktop:rounded-2xl border border-border bg-primary/20 p-6 desktop:p-8 [@media(max-height:500px)_and_(orientation:landscape)]:flex-row [@media(max-height:500px)_and_(orientation:landscape)]:p-4">
      <Image
        src={project.src}
        alt={project.alt}
        width={1200}
        height={750}
        // Matches --card-w in ProjectCarousel minus the card padding.
        sizes="(min-width: 1024px) 500px, (min-width: 640px) 400px, 76vw"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="h-auto w-full object-cover transition-transform duration-300 [@media(max-height:500px)_and_(orientation:landscape)]:w-2/5 [@media(max-height:500px)_and_(orientation:landscape)]:shrink-0"
      />

      <div className="flex w-full flex-1 flex-col items-center gap-4 desktop:gap-8 [@media(max-height:500px)_and_(orientation:landscape)]:self-stretch [@media(max-height:500px)_and_(orientation:landscape)]:justify-center [@media(max-height:500px)_and_(orientation:landscape)]:gap-2">
        <h2 className="text-center text-2xl desktop:text-4xl font-semibold [@media(max-height:500px)_and_(orientation:landscape)]:text-lg">
          {project.name}
        </h2>
        <p className="text-center text-xl desktop:text-2xl [@media(max-height:500px)_and_(orientation:landscape)]:text-sm">
          {project.what}
        </p>
        {/* <p className="text-center text-foreground">{project.why}</p>
        <p className="text-center text-foreground">{project.hardBit}</p> */}

        <ul className="flex flex-wrap justify-center gap-2 desktop:gap-4 text-sm desktop:text-lg text-muted-foreground [@media(max-height:500px)_and_(orientation:landscape)]:text-xs">
          {project.stack.map((t) => (
            <li
              key={t}
              className="rounded-full border border-black bg-black px-3 desktop:px-6 py-1 desktop:py-2 text-white [@media(max-height:500px)_and_(orientation:landscape)]:px-2 [@media(max-height:500px)_and_(orientation:landscape)]:py-0.5"
            >
              {t}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-4 desktop:gap-4 pt-2 desktop:pt-0 desktop:text-lg [@media(max-height:500px)_and_(orientation:landscape)]:mt-0 [@media(max-height:500px)_and_(orientation:landscape)]:pt-0 [@media(max-height:500px)_and_(orientation:landscape)]:text-sm">
          <Link
            href={project.href}
            className="underline underline-offset-4 desktop:underline-offset-8 hover:text-primary"
          >
            View it live
          </Link>
        </div>
      </div>
    </article>
  );
}
