import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavigationBar from '@features/NavigationBar';
import { ThemeProvider } from '@mui/material'
import theme from '@app/Theme'




export default function Index() {
  return(
      <>
        <ThemeProvider theme={theme}>
          <NavigationBar />
          <div className="container mx-auto my-auto">
            <div className="text-center text-2xl">
              <Link href="/gif-hunter">GIF Hunter</Link>
            </div>
            <div className="text-center text-2xl">
              <Link href="/user-dashboard">User Dashboard</Link>
            </div>
          </div>
        </ThemeProvider>
      </>
    
  )
}