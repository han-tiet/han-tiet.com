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

  const APIErrorMessage = () => {
    if (results1.status === "rejected") {
      return (
        <Typography variant="h6" component="span" sx={{ color: "red" }}>
          Error: Cannot connect to Giphy API
        </Typography>
      );
    }

    if (results2.status === "rejected") {
      return (
        <Typography variant="h6" component="span" sx={{ color: "red" }}>
          Error: Cannot connect to Klipy API
        </Typography>
      );
    }
  };

  const gifs1 = results1.status === "fulfilled" ? results1.value : [];
  const gifs2 = results2.status === "fulfilled" ? results2.value : [];

  return (
      <Box sx={{ display: "flex-col", alignItems: "center" }}>
        <Typography
          variant="h3"
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
        <Search />
        <Results source_1={gifs1} source_2={gifs2} />
        <Box sx={{ display: "flex", justifyContent: "center", p: "2rem" }}>
          {APIErrorMessage()}
        </Box>
      </Box>
      
  );
}
