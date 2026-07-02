"use client";

import { useState, useEffect, useTransition } from "react";
import { Box, TextField } from "@mui/material";
import Form from "next/form";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function IndexSearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(searchParams.get("p") ?? "");
  }, [searchParams]);

  const handleSubmit = () => {
    startTransition(() => {
      router.push(`${pathname}/search/?p=${encodeURIComponent(value)}`);
    });
  };

  return (
    <Box sx={{ width: "50rem", my: 8, mx: "auto" }}>
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
            disabled={isPending}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            fullWidth
          />
        </Box>
      </Form>
    </Box>
  );
}
