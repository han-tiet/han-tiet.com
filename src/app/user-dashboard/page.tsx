'use client'

import {useState, useEffect} from "react"
import Sidebar from "@features/Sidebar"

export default function UserDashboard () {
  const [user, setUser]: any = useState({})

  useEffect (() => {
    const fetchData = async () => {
      try {
        const resp = await fetch ("https://jsonplaceholder.typicode.com/users/1")
        const data = await resp.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchData() // Call fetchData
  }, []) // Empty dependency array means function only runs once on mount

  return (
    <div>
      <Sidebar 
      username={user.username}
      email={user.email}
      city={user.address.city}
      />
    </div>
  )
}