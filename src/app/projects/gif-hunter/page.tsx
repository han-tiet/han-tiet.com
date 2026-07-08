import { Suspense } from "react";
import IndexSearchBar from "@/features/gif-hunter/components/IndexSearchBar";
import { Box, Typography } from "@mui/material";

export default async function GifHunter() {
  return (
    <div>
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
      <Box sx={{ display: "flex-col", alignItems: "center", paddingY: "25vh" }}>
        <Typography
          variant="h1"
          component="a"
          href="/projects/gif-hunter"
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
          <IndexSearchBar />
        </Suspense>
      </Box>
    </div>
  );
}
