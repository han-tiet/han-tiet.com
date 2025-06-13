"use client"
import React from "react"
import { Box, TextField, Button } from '@mui/material'
import Form from "next/form"



export default function Search() {
  return(
    <Form action="/gif-hunter/search">
      <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}/>
      <TextField
        id="outlined-basic" 
        label="Search for a GIF here"
        variant="outlined" 
        name="p"
      />
    <Button type="submit">Search</Button>
    </Form>
    
  )
}
