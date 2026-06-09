import React from "react";
import Search from "@/features/gif-hunter/components/Search";
import Results from "@/features/gif-hunter/components/Results";
import { Box, Typography } from "@mui/material";
import notFound from "@/app/projects/gif-hunter/not-found";

export default async function resultsPage({
  searchParams,
}: {
  searchParams: Promise<{ p: string }>;
}) {
  const { p } = await searchParams;

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

  if (results1.status === "rejected" && results2.status === "rejected") {
    return notFound();
  }

  const gifs1 = results1.status === "fulfilled" ? results1.value : [];
  const gifs2 = results2.status === "fulfilled" ? results2.value : [];

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h3"
          component="a"
          href="/projects/gif-hunter"
          sx={{ textDecoration: "none", color: "black" }}
        >
          GIFHunter
        </Typography>
      </Box>
      <Search />
      <Results source_1={gifs1} source_2={gifs2} />
    </Box>
  );
}
