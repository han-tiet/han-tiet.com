"use client"
import React from "react"
import {Form, Button, Input} from "@heroui/react"

export default function Search() {
  return(
    <Form action="/gif-hunter/search">
      <Input
        name="p"
        placeholder="Search for a GIF here"
      />
      <Button type="submit">Search</Button>
    </Form>
  )
}
