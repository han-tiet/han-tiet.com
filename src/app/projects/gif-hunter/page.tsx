import { Suspense } from "react";
import IndexSearchBar from "@/features/gif-hunter/components/IndexSearchBar";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/constants/routes";

export default async function GifHunter() {
  return (
    <div>
      <Box sx={{ display: "flex-col", alignItems: "center", paddingY: "30vh" }}>
        <Typography
          variant="h1"
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
          <IndexSearchBar />
        </Suspense>
      </Box>
    </div>
  );
}
