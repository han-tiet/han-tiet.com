"use client";

import Form from "next/form";
import { Button } from "@/features/spotify-artist-collage/src/components/ui/button";
import { LogOutAction } from "@/app/actions/auth";

export default function LogOutButton() {
  return (
    <div className="ml-auto">
      <Form action={LogOutAction}>
        {/* Smaller on phones, back to the button's own size from md up. The
            inherited `py-2` suits every step: 8 + a 16px `text-xs` line box
            + 8 is the 32px of `h-8`, 8 + 20 + 8 is the 36px of `h-9`, and
            8 + 24 + 8 is the 40px of `h-10`. Desktop stops at 40px because
            the bar is only `md:min-h-[5vh]`, so the feature button's 1.5x
            size of 54px pushed it taller. */}
        <Button
          variant="destructive"
          type="submit"
          className="h-8 px-3 text-xs md:h-9 md:px-4 md:text-sm desktop:h-10 desktop:px-5 desktop:py-2 desktop:text-base"
        >
          Log Out
        </Button>
      </Form>
    </div>
  );
}
