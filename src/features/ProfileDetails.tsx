import UserDetails from "@features/UserDetails"

export default function ProfileDetails ({ children }: any) {
  return (
    <UserDetails>
      {children}
    </UserDetails>
  )
}