'use server'

import * as React from "react"
import Link from "@mui/material/Link"
import Search from "@features/Search"
import { Box, Typography } from "@mui/material"

export default async function GifHunter() {
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography variant= "h3" align= "center" >GIFHunter</Typography>
      </Box>
      <Search />
    </div>
      
  )
}