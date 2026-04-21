import React from "react";
import Search from "@/features/gif-hunter/components/Search";
import Results from "@/features/gif-hunter/components/Results";
import { Box, Typography } from "@mui/material";
import notFound from "@/app/not-found";

export default async function resultsPage({
  searchParams,
}: {
  searchParams: Promise<{ p: string }>;
}) {
  const { p } = await searchParams;
  // console.log(p)

    const giphyResp = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GH_API_KEY_1}&q=${p}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`,
    );
    const tenorResp = await fetch(
      `https://api.klipy.com/api/v1/${process.env.GH_API_KEY_2}/gifs/search?page=1&per_page=24&q=${p}&customer_id=guest&locale=uk&content_filter=off`,
    );

    if (!giphyResp.ok || !tenorResp.ok) {
      return notFound()
    }

    const respJson = await Promise.all([giphyResp.json(), tenorResp.json()]);
  

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography
          variant="h3"
          component="a"
          href="/gif-hunter"
          sx={{ textDecoration: "none", color: "black" }}
        >
          GIFHunter
        </Typography>
      </Box>
      <Search />
      <Results source_1={respJson[0].data} source_2={respJson[1].data.data} />
    </Box>
  );
}