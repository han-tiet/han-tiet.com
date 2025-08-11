import UserDetails from "@features/UserDetails"
import { useUser } from "@app/user-dashboard/UserContext"

export default function ProfileDetails ({ children }: any) {
  return (
    <UserDetails>
      {children}
    </UserDetails>
  )
}