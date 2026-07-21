import { Suspense } from "react";
import SearchBar from "@/features/gif-hunter/components/SearchBar";
import Results from "@/features/gif-hunter/components/Results";
import { Box, Typography } from "@mui/material";
import notFound from "@/app/projects/gif-hunter/not-found";
import { ROUTES } from "@/constants/routes";

export default async function GifHunter({
  searchParams,
}: {
  searchParams: Promise<{ p: string }>;
}) {
  const { p } = await searchParams;

  const resp = await fetchResults(p);

  if (resp.gifs.length === 0) {
    return notFound();
  }

  const APIError = APIErrorMessage(resp.status1, resp.status2);

  return (
    <Box sx={{ display: "flex-col", alignItems: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          height: "5vh",
          padding: "1vw",
          "&:hover": { color: "oklch(0.6911 0.2062 41.46)" },
        }}
      >
        <a href={`${process.env.NEXT_PUBLIC_PROJECTS}`}>&lt;&lt; Projects</a>
      </Box>
      <Typography
        variant="h2"
        component="a"
        href={ROUTES.GIFHUNTER_INDEX}
        sx={{
          display: "flex",
          justifyContent: "center",
          textDecoration: "none",
          color: "black",
        }}
      >
        GIFHunter
      </Typography>
      <Suspense fallback={<></>}>
        <SearchBar />
      </Suspense>
      <Results source={resp.gifs} />
      {APIError && (
        <Box sx={{ display: "flex", justifyContent: "center", p: "2rem" }}>
          <Typography variant="h6" component="span" sx={{ color: "red" }}>
            {APIError.message}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

async function fetchResults(p) {
  async function fetchResults1() {
    const resp = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GH_API_KEY_1}&q=${p}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    );
    const json = await resp.json();
    return json.data;
  }

  async function fetchResults2() {
    const resp = await fetch(
      `https://api.klipy.com/api/v1/${process.env.GH_API_KEY_2}/gifs/search?page=1&per_page=24&q=${p}&customer_id=guest&locale=uk&content_filter=off`,
    );
    const json = await resp.json();
    return json.data.data;
  }

  const [results1, results2] = await Promise.allSettled([
    fetchResults1(),
    fetchResults2(),
  ]);

  const gifs1 = results1.status === "fulfilled" ? results1.value : [];
  const gifs2 = results2.status === "fulfilled" ? results2.value : [];

  const fromGiphy = (gif: React.ReactNode) => ({
    key: gif.id,
    src: `https://i.giphy.com/${gif.id}.webp`,
    id: gif.id,
    title: gif.title,
  });

  const fromKlipy = (gif: React.ReactNode) => ({
    key: gif.id,
    src: gif.file.hd.gif.url,
    id: gif.id,
    title: gif.title,
  });

  const gifs = [...gifs1.map(fromGiphy), ...gifs2.map(fromKlipy)];

  return { gifs: gifs, status1: results1.status, status2: results2.status };
}

function APIErrorMessage(status1, status2) {
  if (status1 === "rejected") {
    return {
      message: "Error: Cannot connect to Giphy API",
    };
  }

  if (status2 === "rejected") {
    return {
      message: "Error: Cannot connect to Klipy API",
    };
  }
}
