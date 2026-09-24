import type { Metadata } from "next";
import NavigationBar from "@/components/NavigationBar";
import ProjectCarousel from "@/components/ProjectCarousel";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects I have built to learn programming concepts",
};

export default function Projects() {
  return (
    <>
      <NavigationBar />
      <main className="mx-auto w-full max-w-6xl px-6">
        <ProjectCarousel projects={PROJECTS} />
      </main>
    </>
  );
}
