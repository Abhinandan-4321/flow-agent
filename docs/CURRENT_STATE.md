# FlowAgent — Current State

## Project Status

Phase 1 — Authentication (complete and fully manually verified)

## Current Phase

Phase 1 — Authentication

## Completed

### Phase 0 — Project Foundation
* Next.js application initialized
* Git repository initialized
* Product definition established
* Architecture established
* Development roadmap established
* Development rules established
* Supabase project created
* `.env.local` created with Supabase credentials
* `@supabase/supabase-js` installed
* `lib/supabase/client.ts` created
* Next.js → Supabase connection verified

### Phase 1 — Authentication

#### Infrastructure
* `@supabase/ssr` installed
* `lib/supabase/server.ts` — server-side Supabase client with cookie handling
* `lib/supabase/client.ts` — updated to use `createBrowserClient` from `@supabase/ssr`
* shadcn/ui initialized (Button, Input, Label, Card components)
* `lib/utils.ts` — `cn()` utility
* `lib/validations/auth.ts` — Zod schemas (signUp, login, forgotPassword, resetPassword)
* `lib/auth/profile.ts` — `getUserProfile()` utility (Auth metadata + DiceBear avatar)
* `features/auth/actions.ts` — Server Actions: signUp, login, logout, forgotPassword, resetPassword

#### Authentication UI
* `app/(auth)/layout.tsx` — shared centered auth layout
* `app/(auth)/signup/page.tsx` — sign-up form + "Check your email" success state
* `app/(auth)/login/page.tsx` — login form with Forgot password link
* `app/(auth)/forgot-password/page.tsx` — password reset request form
* `app/(auth)/reset-password/page.tsx` — new password form
* `app/(auth)/auth/callback/route.ts` — email verification callback
* `app/(auth)/auth/reset-callback/route.ts` — password reset callback

#### Authenticated Application
* `app/dashboard/page.tsx` — minimal authenticated entry point (user profile + logout)
* `proxy.ts` — route protection for `/dashboard/*` using `getUser()` (Next.js 16 proxy)

#### Architecture Decisions
* User name stored in Supabase Auth `user_metadata.full_name`
* No application-level profile database table yet (Phase 2+)
* Avatar: DiceBear `avataaars` style, seeded from `user.id`, derived client-side
* Login redirects to `/dashboard` after successful authentication
* Route protection: unauthenticated `/dashboard` access → `/login?next=/dashboard`
* Safe redirect: only relative paths starting with `/` are accepted as `next` values
* Existing email signup: Shows generic success message (Supabase security feature prevents email enumeration)

## Verified

* `npm run build` passes (zero TypeScript errors)
* Sign-up → verification email → email verification → login → dashboard flow (manually verified)
* Session persists after page refresh (manually verified)
* Login works with verified account (manually verified)
* Logout works and clears session (manually verified)
* Route protection redirects unauthenticated users (manually verified)
* Existing email signup shows generic success message (security feature - prevents email enumeration)
* Password reset end-to-end flow (request → email → callback → new password → login) (manually verified)
* Invalid verification link handling (manually verified)
* Invalid password reset link handling (manually verified)
* Invalid login attempts (wrong password, unverified account, empty fields) (manually verified)
* Invalid signup attempts (empty fields, invalid email, short password, password mismatch) (manually verified)
* Invalid password reset validation (mismatch, short password) (manually verified)
* Dashboard profile display (name, email, avatar) (manually verified)
* Avatar determinism (consistent across refreshes) (manually verified)
* Safe next redirect (external URLs blocked, internal paths work) (manually verified)
* Dark mode (all pages readable, no invisible elements) (manually verified)
* Light mode (all pages readable, good contrast) (manually verified)

## Not Yet Manually Verified

None — all Phase 1 features fully tested and verified

## In Progress

None

## Current Task

None

## Next Task

Phase 2 — Project Management (Tasks, Projects, Milestones)

## Known Issues

None

## Temporary Decisions

* Login redirect currently goes to `/dashboard`. Dashboard is a minimal Phase 1 stub.
  Will be expanded in Phase 2+.
* `NEXT_PUBLIC_SITE_URL` env variable used for password reset redirectTo. Falls back to
  `http://localhost:3000` if not set. Set this in `.env.local` and production environment.

## Required Supabase Dashboard Configuration

* Authentication → URL Config → Site URL: `http://localhost:3000`
* Authentication → URL Config → Redirect URLs: `http://localhost:3000/**`
* Authentication → Email Templates → Reset Password: link must use
  `{{ .SiteURL }}/auth/reset-callback?token_hash={{ .TokenHash }}&type=recovery`
* Authentication → SMTP: Mailtrap configured for development email delivery

## Not Started

* Database schema
* Projects
* Tasks
* Milestones
* Labels
* Comments
* Kanban
* Task history
* Slack integration
* AI agent
* MCP integration
* Deployment
* Landing page
