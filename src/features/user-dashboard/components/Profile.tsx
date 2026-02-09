import ProfileDetails from "@/features/user-dashboard/components/ProfileDetails";

type Props = {
  children: React.ReactNode;
};

export default function Profile({ children }: Props) {
  return <ProfileDetails>{children}</ProfileDetails>;
}
