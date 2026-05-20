"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NavButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Button
        className={`${isActive ? "bg-primary" : "bg-background"} text-[18px] h-[52px] px-[16px]`}
      >
        {children}
      </Button>
    </Link>
  );
}
