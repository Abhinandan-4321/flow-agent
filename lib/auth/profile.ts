import type { User } from "@supabase/supabase-js";

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
};

function getAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${userId}`;
}

export function getUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "User",
    avatarUrl: getAvatarUrl(user.id),
  };
}
