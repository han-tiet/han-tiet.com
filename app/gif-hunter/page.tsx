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

	new Promise((resolve) => {
		setTimeout(resolve, 0)
	})
		
	const resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${p}&limit=3&offset=0&rating=r&lang=en&bundle=messaging_non_clips`)
	const respJSON = await resp.json()

  return(
  <div className="container mx-auto">
    <Search /> 
  </div>
     
)
}