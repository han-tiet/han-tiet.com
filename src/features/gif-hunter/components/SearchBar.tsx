"use client";

import { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(searchParams.get("p") ?? "");
  }, [searchParams]);

  return (
    <Box
      sx={{
        width: { xs: "90vw", sm: "30rem" },
        my: { xs: 3, md: 5 },
        mx: "auto",
      }}
    >
      <Form action={ROUTES.GIFHUNTER_SEARCH}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            value={value}
            id="search-bar"
            label="Search for a GIF here"
            variant="outlined"
            name="p"
            onChange={(e) => setValue(e.target.value)}
            fullWidth
          />
        </Box>
      </Form>
    </Box>
  );
}
