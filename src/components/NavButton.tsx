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
          "text-[1.25rem] h-[1.5rem] px-[1.5rem] py-[2rem]",
          buttonClassName,
        )}
      >
        {children}
      </Button>
    </Link>
  );
}
