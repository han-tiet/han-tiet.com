import React from "react"
import Link from "@mui/material/Link"
import Search from "@features/Search"

export default async function GifHunter() {
  return (
    <div className="mx-auto">
      <div className="text-center text-6xl font-bold my-5 ">
        <a href="/gif-hunter">GIFHunter</a>
      </div>
      <Search />    
    </div>     
  )
}