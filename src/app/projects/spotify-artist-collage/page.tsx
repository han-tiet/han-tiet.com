import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/features/spotify-artist-collage/src/components/Navbar";
import { Collage } from "@/features/spotify-artist-collage/src/components/Collage";
import { ROUTES } from "@/constants/routes";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(ROUTES.SPOTIFY_ARTIST_COLLAGE__LOGIN);
  } else {
    const data = await fetchArtists();
    const user = await fetchUser();

    return (
      <div className="grid grid-cols-12">
        <Navbar user={user.display_name} />
        <div className="col-span-full px-4 desktop:px-6 py-8 desktop:py-12 flex justify-center items-start text-5xl md:col-start-2 md:col-span-10 md:items-center md:min-h-[85vh] md:py-0">
          <Collage data={data} />
        </div>
      </div>
    );
  }
}

async function fetchArtists() {
  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "spotify",
    },
    headers: await headers(),
  });
  const resp = await fetch(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );

  const data = await resp.json();
  const artists = data.items;

  return artists;
}

async function fetchUser() {
  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "spotify",
    },
    headers: await headers(),
  });
  const resp = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  return await resp.json();
}
