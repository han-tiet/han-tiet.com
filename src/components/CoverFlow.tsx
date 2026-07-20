"use client";

import styles from "@/app/projects/page.module.css";
import { useRef, useEffect, useState } from "react";
import { Project, ProjectProps } from "@/components/Project";
import { ROUTES } from "@/constants/routes";

export default function CoverFlow() {
  const projects = [
    {
      name: "GIFHunter",
      description: "A GIF Search Engine",
      href: ROUTES.GIFHUNTER_INDEX,
      src: `${process.env.NEXT_PUBLIC_HOST}/images/gifhunter-screen.png`,
      techsUsed: ["NextJS", "Typescript", "Fetch API"],
    },
    {
      name: "Spotify Artist Collage",
      description: "Your Top 50 Artists",
      href: ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN,
      src: `${process.env.NEXT_PUBLIC_HOST}/images/spotify-artist-collage-screen.png`,
      techsUsed: ["CSS Animations", "OAuth", "Server Actions"],
    },
  ];

  const [currentInfo, setCurrentInfo] = useState(projects[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateCenteredCover = () => {
      const cover = el.querySelector("img");
      const coverWidth = cover?.width;
      const containerCenter = el.scrollLeft + coverWidth / 2;
      const centeredIndex = Math.round(containerCenter / coverWidth - 0.5);
      const clampedIndex = Math.max(
        0,
        Math.min(centeredIndex, projects.length - 1),
      );
      setCurrentInfo(projects[clampedIndex]);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();

        const cover = el.querySelector("img");
        const coverWidth = cover?.width;
        el.scrollLeft += e.deltaY > 0 ? coverWidth : -coverWidth;
        console.log(`scrollLeft: ${el.scrollLeft} coverwidth: ${coverWidth}`);

        // Read scrollLeft after the scroll has been applied
        setTimeout(updateCenteredCover, 0);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scrollend", updateCenteredCover);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scrollend", updateCenteredCover);
    };
  });

  return (
    <>
      <div ref={ref} className={styles.container}>
        <ul className={styles.covers}>
          {projects.map((project: ProjectProps) => (
            <li key={project.name}>
              <Project
                name={project.name}
                description={project.description}
                href={project.href}
                src={project.src}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-center">
        <div id="title" className="flex flex-row text-lg font-semibold pt-2">
          {currentInfo.name}
        </div>
        <div
          id="tech-used"
          className="flex flex-col items-center width-full py-2"
        >
          <div className="text-md">Technologies Used</div>
          {currentInfo.techsUsed.map((tech, i) => (
            <div key={`tech-${i + 1}`} className="text-sm">
              {tech}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
