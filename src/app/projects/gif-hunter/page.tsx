import IndexSearchBar from "@/features/gif-hunter/components/IndexSearchBar";
import { Box, Typography } from "@mui/material";

export default async function GifHunter() {
  return (
    <Box sx={{ display: "flex-col", alignItems: "center", paddingY: "30vh" }}>
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
      <IndexSearchBar />
    </Box>
  );
}
