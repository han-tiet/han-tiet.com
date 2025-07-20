"use client"
import React from "react"
import { Box, TextField, Button } from '@mui/material'
import Form from "next/form"



export default function Search() {
  return(
    <Box sx={{width: "30rem", my: 5, mx: "auto"}}>
      <Form action="/gif-hunter/search">
        <Box sx={{width: "auto"}} display="flex" alignItems="center" >
          <TextField
            id="outlined-basic"
            label="Search for a GIF here"
            variant="outlined"
            name="p"
            fullWidth
          />
          <Box padding={2}>
            <Button variant="contained" type="submit" size="large">Search</Button>
          </Box>
        </Box>
      </Form>
    </Box>   
  )
}
