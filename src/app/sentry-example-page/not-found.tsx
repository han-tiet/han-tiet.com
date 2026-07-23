import Link from "next/link";
import { Button } from "@/features/gif-hunter/components/ui/button";

export default function notFound() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8">
      <div className="font-semibold text-5xl">Error: Page Not Found</div>
      <Button variant="default" size="lg" className="w-auto">
        <Link className="text-lg" href="/projects/gif-hunter">
          Return Home
        </Link>
      </Button>
    </div>
  );
}
