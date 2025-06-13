import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return(
    <body className="bg-yellow-50">
      <div className="text-center text-2xl">
        <Link href="/gif-hunter">GIF Hunter</Link>
      </div>
    </body>
    
  )
}