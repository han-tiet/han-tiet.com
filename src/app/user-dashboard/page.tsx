"use client";

import Sidebar from "@/features/user-dashboard/components/Sidebar";
import { UserProvider } from "@/features/user-dashboard/contexts/UserContext";
import Profile from "@/features/user-dashboard/components/Profile";
import ProfileDetails from "@/features/user-dashboard/components/ProfileDetails";
import UserDetails from "@/features/user-dashboard/components/UserDetails";

// Still need to add components to main page, context won't make them magically appear >:(

// Wrap user dashboard with UserProvider to use context.
export default function UserDashboard() {
  return (
    <UserProvider>
      <Sidebar>
        <Profile>
          <ProfileDetails>
            <UserDetails />
          </ProfileDetails>
        </Profile>
      </Sidebar>
    </UserProvider>
  );
}
