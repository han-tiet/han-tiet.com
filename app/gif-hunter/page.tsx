import React from "react"
import Link from "@mui/material/Link"
import Search from "../components/Search"

export default async function GifHunter({
  // searchParams : A promise that resolves to an object containing the search parameters of the current URL. 
  searchParams, 
  }: {
  searchParams: Promise<{ p: string }>
,}) {
  const { p } = await searchParams

	const giphyResp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY_1}&q=${p}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`)
  const tenorResp = await fetch (`https://tenor.googleapis.com/v2/search?key=${process.env.API_KEY_2}&q=${p}&client_key=gifhunter&country=GB&locale=en_GB&limit=10`)

  const respJson = await Promise.all([
    giphyResp.json(),
    tenorResp.json(),
  ])

  return (
    <div className="mx-auto">
      <div className="text-center text-6xl font-bold my-5 ">
        <a href="/gif-hunter">GIFHunter</a>
      </div>
      <Search />    
    </div>     
  )
}