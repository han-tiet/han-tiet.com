import React from "react"
import Search from "@/app/components/Search"
import Results from "@/app/components/Results"

export default async function resultsPage({searchParams, }: {searchParams: Promise<{ p: string }>,}) {
  const { p } = await searchParams
  console.log(p)
		
	const giphyResp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY_1}&q=${p}&limit=10&offset=0&rating=r&lang=en&bundle=messaging_non_clips`)
  const tenorResp = await fetch (`https://tenor.googleapis.com/v2/search?key=${process.env.API_KEY_2}&q=${p}&client_key=gifhunter&country=GB&locale=en_GB&limit=10`)

  const respJson = await Promise.all([
    giphyResp.json(),
    tenorResp.json(),
  ])
  
  return(
  <div className="mx-auto">
    <div className="text-center text-6xl font-bold my-5 ">
      <a href="/gif-hunter">GIFHunter</a>
    </div>
    <Search />
 
    <Results
      source_1={respJson[0].data}
      source_2={respJson[1].results}
    />
    
  </div>
)
}
