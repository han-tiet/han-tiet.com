export default function UserDetails ({username, email, city}: any) {
  return (
    <div>
      <h1>{username}</h1>
      <h2>{email}</h2>
      <h3>{city}</h3>
    </div>
  )
}