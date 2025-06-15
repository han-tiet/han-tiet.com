import React from "react"
import Search from "@/app/components/Search"
import Results from "@/app/components/Results"

export default async function resultsPage({searchParams, }: {searchParams: Promise<{ p: string }>,}) {
  const { p } = await searchParams
  console.log(p)
		
	const resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${p}&limit=20&offset=0&rating=r&lang=en&bundle=messaging_non_clips`)
	const respJSON = await resp.json()
  
  return(
  <div className="container flex align-items-center">
    <div>
      <a href="/gif-hunter">GIFHunter</a>
    </div>
    <Search />
    <Results
      gifs={respJSON.data}
    />
  </div>
)
}
