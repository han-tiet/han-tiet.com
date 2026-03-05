"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NavButton() {
  // const pathname = usePathname();
  // const isActive = pathname === href;

  return (
    <Link href="/contact">
      <Button className={`text-[18px] h-[52px] w-[170px] px-[16px]`}>
        Submit
      </Button>
    </Link>
  );
}
