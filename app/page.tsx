import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavigationBar from './components/NavigationBar';


export default function Index() {
  return(
      <>
        <NavigationBar />
        <div className="mt-16">
          <div className="container text-center text-2xl">
            <Link href="/gif-hunter">GIF Hunter</Link>
          </div>
        </div>
      </>
    
  )
}