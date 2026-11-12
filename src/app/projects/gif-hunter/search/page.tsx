import { Suspense } from "react";
import SearchBar from "@/features/gif-hunter/components/SearchBar";
import Results from "@/features/gif-hunter/components/Results";
import {
  fetchResults,
  APIErrorMessage,
} from "@/features/gif-hunter/lib/fetchResults";
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
          minHeight: "4rem",
          padding: "0rem 0rem 0rem 1rem",
          // Matches the `text-sm md:text-lg desktop:text-xl` back link on the
          // Spotify Artist Collage pages. Raw media queries rather than MUI
          // breakpoint keys: MUI's `md` is 900px where Tailwind's is 768px,
          // and `desktop` is a pointer query MUI cannot express. `desktop` is
          // listed after `md` so it wins at the same width on a fine pointer,
          // which is the order the compiled Tailwind emits.
          fontSize: "1rem",
          lineHeight: "1.25rem",
          "@media (min-width: 48rem)": {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          },
          "@media (pointer: fine) and (min-width: 48rem)": {
            fontSize: "1.25rem",
            lineHeight: "1.75rem",
          },
          "&:hover": { color: "oklch(0.6911 0.2062 41.46)" },
        }}
      >
        <a href={ROUTES.PROJECTS}>&lt;&lt; Projects</a>
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
          fontSize: { xs: "2rem", sm: "2.75rem", md: "3.75rem" },
        }}
      >
        GIFHunter
      </Typography>
      <Suspense fallback={<></>}>
        <SearchBar />
      </Suspense>
      <Results key={p} source={resp.gifs} />
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
