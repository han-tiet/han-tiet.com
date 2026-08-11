import { Button } from "./ui/Button";
import Link from "next/link";

export function CTAButton() {
  return (
    <Link href="/projects">
      <Button className="text-[18px] h-[52px] px-[16px] py-[12px]">
        View Projects &gt;&gt;{" "}
      </Button>
    </Link>
  );
}
