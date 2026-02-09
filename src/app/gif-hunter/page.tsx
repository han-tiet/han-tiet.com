"use server";

import * as React from "react";
import Search from "@features/gif-hunter/components/Search";
import { Box, Typography } from "@mui/material";

export default async function GifHunter() {
  return (
    <div>
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
    </div>
  );
}
