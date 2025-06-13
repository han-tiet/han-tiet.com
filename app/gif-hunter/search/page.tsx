import React from "react"
import Search from "@/app/components/Search"

export default async function resultsPage({searchParams,}: {searchParams: Promise<{ p : string }>,}) {
  const {p} = await searchParams
  const query = p
  console.log(query)
		
	const resp = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.API_KEY}&q=${p}&limit=3&offset=0&rating=r&lang=en&bundle=messaging_non_clips`)
	const respJSON = await resp.json()
  
  return(
  <body className="bg-gray-800 text-white">
    <div className="container flex align-items-center">
      <Search />
      {respJSON.data[0].title}
    </div>
    
    
    
  </body>
)
}
