import { useUser } from "@/features/user-dashboard/contexts/UserContext";

export default function UserDetails() {
  const user = useUser(); // Exported from UserContext to pass props directly to deeply nested component

  return (
    <div>
      <h1>{user!.username}</h1>
      <h2>{user!.email}</h2>
      <h3>{user!.address.city}</h3>
    </div>
  );
}
