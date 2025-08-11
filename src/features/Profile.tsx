import ProfileDetails from "@features/ProfileDetails"
import { useUser } from "@app/user-dashboard/UserContext"
import { UserProvider } from "@app/user-dashboard/UserProvider"

export default function Profile ({ children }: any) {
  return (
    <ProfileDetails>
      {children}
    </ProfileDetails>
  )
}