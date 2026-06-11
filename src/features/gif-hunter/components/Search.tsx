"use client";

import { useState, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("p") ?? "");

  useEffect(() => {
    setValue(searchParams.get("p") ?? "");
  }, [searchParams]);

  return (
    <Box sx={{ width: "30rem", my: 5, mx: "auto" }}>
      <Form action="/projects/gif-hunter/search">
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
