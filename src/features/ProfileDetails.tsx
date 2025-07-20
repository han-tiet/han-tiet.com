import UserDetails from "@features/UserDetails"

export default function ProfileDetails ({username, email, city}: any) {
  return (
    <UserDetails 
      username={username}
      email={email}
      city={city}
    />
  )
}