"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function NavButton({
  href,
  children,
  className,
  buttonClassName,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} onClick={onNavigate} className={className}>
      <Button
        className={cn(
          isActive ? "bg-primary" : "bg-background",
          "text-[1.5rem] h-[2rem] px-[2rem] py-[2.5rem]",
          buttonClassName,
        )}
      >
        {children}
      </Button>
    </Link>
  );
}
