import NavigationBar from "@/components/NavigationBar";
import CoverFlow from "@/components/CoverFlow";

export default function Projects() {
  return (
    <>
      <NavigationBar />
      <CoverFlow />
      <div className="flex justify-center p-[3%] text-sm text-gray-400">
        Scroll for more projects
      </div>
    </>
  );
}
