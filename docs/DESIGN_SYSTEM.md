# FlowAgent — Public Landing Experience

## Purpose

FlowAgent has two primary visual experiences:

1. The public landing experience
2. The authenticated product experience

Both must share the same FlowAgent design language while serving different purposes.

The landing page introduces FlowAgent, communicates its value proposition, demonstrates its core capabilities, and provides clear paths to sign up or sign in.

The authenticated application prioritizes productivity, information density, and efficient interaction.

---

## Landing Page Design Philosophy

The landing page should feel polished and visually impressive without becoming visually noisy.

It may be more expressive than the authenticated application, but it must retain FlowAgent's core principles:

* Minimal
* Calm
* Professional
* Technical
* Restrained
* High quality
* Purposeful

The landing page should be inspired by the restraint and polish of modern developer-focused products such as Linear, but must have its own FlowAgent identity.

---

## Landing Page Structure

The initial landing page should conceptually contain:

### 1. Navigation

Include:

* FlowAgent logo/name
* Product navigation where useful
* Sign In
* Get Started / Sign Up

Navigation should remain minimal.

---

### 2. Hero

The hero should immediately communicate what FlowAgent is.

It should contain:

* Strong headline
* Short supporting statement
* Primary CTA
* Secondary CTA where useful
* Product visual or UI preview

The headline should emphasize FlowAgent's core value rather than generic AI terminology.

The AI should be presented as a capability that makes project management easier, not as the entire identity of the product.

---

### 3. Product Demonstration

Show the actual FlowAgent product interface.

Possible demonstrations include:

* Project dashboard
* Kanban board
* Task detail
* Task creation
* AI interaction

The product visual should use the same design system as the authenticated application.

---

### 4. AI + Slack Differentiator

The landing page should clearly communicate that FlowAgent can be controlled conversationally through Slack.

Example conceptual flow:

```text
User
  ↓
@FlowAgent create a task...
  ↓
AI interprets request
  ↓
FlowAgent tools
  ↓
Project Management System
  ↓
Task created
```

This should be one of the most prominent differentiators on the landing page.

---

### 5. Core Features

Explain the primary project-management capabilities:

* Projects
* Tasks
* Milestones
* Kanban
* Collaboration
* Task history
* AI agent
* Slack integration

Feature sections should use real product concepts rather than generic SaaS marketing language.

---

### 6. How It Works

Communicate the simple mental model:

```text
Create a project
      ↓
Organize work
      ↓
Collaborate
      ↓
Ask FlowAgent
      ↓
Get work done
```

---

### 7. Final CTA

The page should end with a clear invitation to create an account.

Example:

```text
Ready to get your work moving?

[ Get Started ]
```

---

## Landing Page Visual Rules

The landing page may use:

* Larger typography
* More whitespace
* Product mockups
* Subtle gradients where appropriate
* Subtle animation
* Larger visual compositions
* Carefully designed feature demonstrations

However, it must avoid:

* Excessive gradients
* Neon colors
* Glassmorphism-heavy layouts
* Generic AI imagery
* Excessive glowing effects
* Decorative blobs
* Excessive animation
* Stock photography
* Generic AI SaaS illustrations

Visual elements should reinforce the product.

---

## Relationship With Authenticated Application

The landing page and application should share:

* Typography
* Color tokens
* Theme system
* Accent color
* Border language
* Radius system
* Iconography
* Button styles
* Light/dark mode

They differ primarily in density and composition.

```text
Landing Page
    ↓
Expressive
    ↓
Marketing + Product storytelling

Authenticated App
    ↓
Dense
    ↓
Productivity + Work execution
```

---

## Landing Page Theme Support

The landing page must support both:

* Light mode
* Dark mode

Dark mode should be designed intentionally rather than generated through simple color inversion.

The product preview shown on the landing page should respect the selected theme where practical.

---

## Landing Page Quality Standard

The landing page is the user's first impression of FlowAgent.

It should communicate:

> "This is a serious, polished product."

It should not communicate:

> "This is an AI-generated demo."

The quality of the landing page should come from typography, spacing, product visuals, hierarchy, interaction, and consistency rather than excessive visual effects.


# UI Component Strategy

## Primary Component Foundation

FlowAgent should primarily use **shadcn/ui** and Tailwind CSS for its core application interface.

This includes:

* Buttons
* Inputs
* Forms
* Selects
* Dialogs
* Dropdowns
* Tabs
* Tables
* Tooltips
* Popovers
* Navigation
* Command palette
* Toasts
* Badges
* Avatars

The goal is to maintain a consistent and accessible component foundation across the authenticated application.

---

## Aceternity UI

Aceternity UI may be used selectively when a component provides a meaningful visual or interaction improvement that fits the FlowAgent design language.

Aceternity UI is particularly appropriate for:

* Public landing page
* Hero sections
* Product demonstrations
* Feature showcases
* AI/Slack demonstrations
* Subtle marketing animations
* Carefully selected visual interactions

Aceternity components should be customized to match the FlowAgent theme rather than used with their default styling when that styling conflicts with this design system.

---

## Selection Rule

Before introducing an Aceternity component, determine:

1. Does it solve a real UX/design problem?
2. Does it fit the FlowAgent visual language?
3. Can it coexist with the existing shadcn/ui components?
4. Does it introduce unnecessary animation or visual noise?
5. Is the additional complexity justified?

If the answer is no, prefer the existing FlowAgent component foundation.

---

## Landing Page Exception

The public landing page may use more expressive Aceternity components than the authenticated application.

The landing page can use:

* More sophisticated animations
* Interactive product demonstrations
* Subtle motion
* Larger visual compositions
* Carefully controlled effects

However, it must still follow the FlowAgent principles of restraint, professionalism, and minimal visual noise.

Aceternity components must never be used simply because they look impressive in isolation.

---

## AI-Specific Components

Aceternity UI may be particularly useful for visually demonstrating FlowAgent's AI capabilities on the landing page.

Examples:

```text
User request
      ↓
FlowAgent AI
      ↓
Tool execution
      ↓
Project update
```

Such components should communicate the product's capabilities rather than function as decorative AI effects.

---

## Component Consistency Rule

The authenticated product should feel like one cohesive application.

Do not mix component libraries arbitrarily.

Prefer:

```text
shadcn/ui
    ↓
FlowAgent theme
    ↓
Feature components
```

with Aceternity UI introduced selectively where appropriate.

Do not introduce additional UI libraries without an explicit architectural decision.
