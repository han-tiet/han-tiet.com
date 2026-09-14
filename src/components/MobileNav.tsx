"use client";

import { useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { MenuIcon, XIcon } from "lucide-react";
import NavButton from "@/components/NavButton";
import { ROUTES } from "@/constants/routes";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Open menu"
        className="flex size-[52px] items-center justify-center rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:hidden touch:flex"
      >
        <MenuIcon className="size-7" />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-200 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />

        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-200 flex h-full w-[40vw] flex-col gap-2 border-l border-border bg-background p-2 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="sr-only">
            Menu
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Links to the other pages on this site
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            aria-label="Close menu"
            className="self-end rounded-md p-1 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <XIcon className="size-5" />
          </DialogPrimitive.Close>

          <nav className="flex flex-col gap-2">
            <NavButton
              href={ROUTES.PROJECTS}
              className="w-full"
              buttonClassName="w-full px-[6px] text-[13px]"
              onNavigate={close}
            >
              Projects
            </NavButton>
            <NavButton
              href={ROUTES.CONTACT}
              className="w-full"
              buttonClassName="w-full px-[6px] text-[13px]"
              onNavigate={close}
            >
              Contact
            </NavButton>
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
