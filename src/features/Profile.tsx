import ProfileDetails from "@features/ProfileDetails"

export default function Profile ({username, email, city}: any) {

  return (
    <ProfileDetails 
      username={username}
      email={email}
      city={city}
    />
  )
}