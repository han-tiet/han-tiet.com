import ProfileDetails from "@features/ProfileDetails"

export default function Profile ({ children }: any) {
  return (
    <ProfileDetails>
      {children}
    </ProfileDetails>
  )
}