import UserDetails from "@/features/user-dashboard/components/UserDetails";

type Props = {
  children: React.ReactNode;
};

export default function ProfileDetails({ children }: Props) {
  return <UserDetails>{children}</UserDetails>;
}
