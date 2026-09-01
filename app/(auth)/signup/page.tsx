"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signUp } from "@/features/auth/actions";

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, undefined);

  if (state?.success && state.email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>Verify your email address to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            If an account with{" "}
            <span className="font-mono font-medium text-foreground">
              {state.email}
            </span>{" "}
            doesn&apos;t exist, we&apos;ve sent a verification link.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. The link will
            expire after 24 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            If you already have an account, you can{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              sign in
            </Link>{" "}
            directly.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already verified?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Get started with FlowAgent</CardDescription>
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              autoFocus
              aria-invalid={!!state?.fieldErrors?.name}
              aria-describedby={
                state?.fieldErrors?.name ? "name-error" : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.name && (
              <p id="name-error" className="text-xs text-destructive">
                {state.fieldErrors.name[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!state?.fieldErrors?.email}
              aria-describedby={
                state?.fieldErrors?.email ? "email-error" : undefined
              }
              disabled={pending}
            />
            {state?.fieldErrors?.email && (
              <p id="email-error" className="text-xs text-destructive">
                {state.fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
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
            <Label htmlFor="confirmPassword">Confirm password</Label>
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
            {pending ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
