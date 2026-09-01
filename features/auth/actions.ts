"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  signUpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

export type FieldErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

export type AuthActionState =
  | {
      fieldErrors?: FieldErrors;
      error?: string;
      success?: boolean;
      email?: string;
    }
  | undefined;

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = signUpSchema.safeParse(raw);

  if (!result.success) {
    const flat = result.error.flatten();
    return {
      fieldErrors: {
        name: flat.fieldErrors["name"],
        email: flat.fieldErrors["email"],
        password: flat.fieldErrors["password"],
        confirmPassword: flat.fieldErrors["confirmPassword"],
      },
    };
  }

  const { name, email, password } = result.data;

  const serverSupabase = await createClient();

  const { error } = await serverSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    // Note: Supabase doesn't return an error for existing emails (security feature)
    // This prevents email enumeration attacks
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true, email };
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);

  if (!result.success) {
    const flat = result.error.flatten();
    return {
      fieldErrors: {
        email: flat.fieldErrors["email"],
        password: flat.fieldErrors["password"],
      },
    };
  }

  const { email, password } = result.data;

  const serverSupabase = await createClient();

  const { error } = await serverSupabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (
      error.message.includes("Email not confirmed") ||
      error.message.includes("email not confirmed")
    ) {
      return { error: "Please verify your email before signing in." };
    }
    if (
      error.message.includes("Invalid login credentials") ||
      error.message.includes("invalid_credentials")
    ) {
      return { error: "Invalid email or password." };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = { email: formData.get("email") };
  const result = forgotPasswordSchema.safeParse(raw);

  if (!result.success) {
    const flat = result.error.flatten();
    return { fieldErrors: { email: flat.fieldErrors["email"] } };
  }

  const { email } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/reset-callback`,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  // Always return success to avoid confirming whether the email exists.
  return { success: true, email };
}

export async function resetPassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const raw = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = resetPasswordSchema.safeParse(raw);

  if (!result.success) {
    const flat = result.error.flatten();
    return {
      fieldErrors: {
        password: flat.fieldErrors["password"],
        confirmPassword: flat.fieldErrors["confirmPassword"],
      },
    };
  }

  const { password } = result.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (error.message.includes("session") || error.message.includes("Auth")) {
      return {
        error:
          "Your password reset link has expired or is invalid. Please request a new one.",
      };
    }
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/login?message=password_updated");
}
