import { Suspense } from "react";
import IndexSearchBar from "@/features/gif-hunter/components/IndexSearchBar";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/constants/routes";

// On short landscape screens (phones on their side) the vh-based padding
// pushes the search bar off the bottom, so the title and search bar are
// centred in the space under the back link instead.
const SHORT_LANDSCAPE =
  "@media (max-height: 500px) and (orientation: landscape)";

export default async function GifHunter() {
  return (
    <Box
      sx={{
        display: "flex-col",
        [SHORT_LANDSCAPE]: {
          display: "flex",
          flexDirection: "column",
          minHeight: "100svh",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          minHeight: "5vh",
          padding: "1vw",
          "&:hover": { color: "oklch(0.6911 0.2062 41.46)" },
        }}
      >
        <a href={`${ROUTES.PROJECTS}`}>&lt;&lt; Projects</a>
      </Box>
      <Box
        sx={{
          display: "flex-col",
          alignItems: "center",
          paddingY: { xs: "12vh", sm: "20vh", md: "30vh" },
          [SHORT_LANDSCAPE]: {
            paddingY: 0,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
      >
        <Typography
          variant="h1"
          component="a"
          href={ROUTES.GIFHUNTER_INDEX}
          sx={{
            display: "flex",
            justifyContent: "center",
            textDecoration: "none",
            color: "black",
            fontSize: { xs: "2.5rem", sm: "3.75rem", md: "6rem" },
          }}
        >
          GIFHunter
        </Typography>
        <Suspense fallback={<></>}>
          <IndexSearchBar />
        </Suspense>
      </Box>
    </Box>
  );
}
