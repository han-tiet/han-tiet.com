"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function LogInAction() {
  await auth.api.signInSocial({
    body: {
      provider: "spotify",
    },
  });
}

export async function LogOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/projects/spotify-artist-collage/login");
}
