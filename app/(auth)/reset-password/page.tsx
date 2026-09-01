"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resetPassword } from "@/features/auth/actions";

export default function ResetPasswordPage() {
  const [state, action, pending] = useActionState(resetPassword, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Choose a new password for your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4" noValidate>
          {state?.error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              aria-invalid={!!state?.fieldErrors?.password}
              aria-describedby={
                state?.fieldErrors?.password ? "password-error" : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.password && (
              <p id="password-error" className="text-xs text-destructive">
                {state.fieldErrors.password[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!state?.fieldErrors?.confirmPassword}
              aria-describedby={
                state?.fieldErrors?.confirmPassword
                  ? "confirm-password-error"
                  : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.confirmPassword && (
              <p id="confirm-password-error" className="text-xs text-destructive">
                {state.fieldErrors.confirmPassword[0]}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Updating password…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
