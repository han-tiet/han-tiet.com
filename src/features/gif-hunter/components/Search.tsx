"use client";
import React from "react";
import { Box, TextField } from "@mui/material";
import Form from "next/form";

export default function Search() {
  return (
    <Box sx={{ width: "30rem", my: 5, mx: "auto" }}>
      <Form action="/gif-hunter/search">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search for a GIF here"
            variant="outlined"
            name="p"
            fullWidth
          />
        </Box>
      </Form>
    </Box>
  );
}
