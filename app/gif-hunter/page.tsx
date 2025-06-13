import React from "react"
import Search from "../components/Search"

export default async function GifHunter({
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
  <body className="bg-gray-800 text-white">
    <Search />    
  </body>
)
}