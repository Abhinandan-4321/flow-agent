import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/auth/profile";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = getUserProfile(user);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            FlowAgent
          </span>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <div className="flex items-center gap-4">
          <Image
            src={profile.avatarUrl}
            alt={profile.fullName}
            width={56}
            height={56}
            className="rounded-full bg-muted"
            unoptimized
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-base font-medium text-foreground">
              {profile.fullName}
            </p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/40 px-6 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Dashboard coming in Phase 2.
          </p>
        </div>
      </main>
    </div>
  );
}
