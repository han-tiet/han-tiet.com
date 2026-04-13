"use client";

import Form from "next/form";
import { Button } from "@/features/spotify-artist-collage/src/components/ui/button";
import { LogOutAction } from "@/app/actions/auth";

export default function LogOutButton() {
  return (
    <div className="ml-auto">
      <Form action={LogOutAction}>
        <Button variant="destructive" type="submit">
          Log Out
        </Button>
      </Form>
    </div>
  );
}
