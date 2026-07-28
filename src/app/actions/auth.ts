"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

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

  redirect(ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN);
}
