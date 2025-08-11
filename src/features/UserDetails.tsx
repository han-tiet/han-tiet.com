import { useUser } from "@app/user-dashboard/UserContext"

export default function UserDetails () {
  const user = useUser() // Used to pass props directly to deeply nested component

  return (
    <div>
      <h1>{user.username}</h1>
      <h2>{user.email}</h2>
      <h3>{user.address.city}</h3>
    </div>
  )
}