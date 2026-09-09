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
    <article className="flex h-full w-full flex-col items-center gap-4 rounded-lg border border-border bg-primary/20 p-6">
      <Image
        src={project.src}
        alt={project.alt}
        width={1200}
        height={750}
        // Matches --card-w in ProjectCarousel minus the p-6 padding.
        sizes="(min-width: 640px) 400px, 76vw"
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="h-auto w-full object-cover transition-transform duration-300"
      />

      <h2 className="text-center text-2xl font-semibold">{project.name}</h2>
      <p className="text-center text-xl">{project.what}</p>
      {/* <p className="text-center text-foreground">{project.why}</p>
      <p className="text-center text-foreground">{project.hardBit}</p> */}

      <ul className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
        {project.stack.map((t) => (
          <li
            key={t}
            className="rounded-full border border-black bg-black px-3 py-1 text-white"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-4 pt-2">
        <Link
          href={project.href}
          className="underline underline-offset-4 hover:text-primary"
        >
          View it live
        </Link>
      </div>
    </article>
  );
}
