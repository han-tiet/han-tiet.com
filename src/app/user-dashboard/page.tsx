'use client'

import Sidebar from "@features/Sidebar"
import { UserProvider } from "@app/user-dashboard/UserContext"
import Profile from "@features/Profile"
import ProfileDetails from "@features/ProfileDetails"
import UserDetails from "@features/UserDetails"

// Still need to add components to main page, context won't make them magically appear >:(

export default function UserDashboard () {
  return (
    <UserProvider>
      <Sidebar>
        <Profile>
          <ProfileDetails>
            <UserDetails />
          </ProfileDetails>
        </Profile>
      </Sidebar> 
    </UserProvider>
    
  )
}