# FlowAgent — Development Roadmap

## 1. Roadmap Philosophy

FlowAgent is built incrementally.

Each phase should produce a working and verifiable part of the system.

Development follows this loop:

```text
Select one task
      ↓
Understand requirements
      ↓
Plan implementation
      ↓
Implement
      ↓
Test
      ↓
Verify manually where appropriate
      ↓
Update CURRENT_STATE.md
      ↓
Commit to Git
      ↓
Move to next task
```

The application should never be developed by attempting to implement an entire phase in one step.

Each roadmap item should be treated as an individual development task.

---

# 2. Development Phases

```text
Phase 0  → Project Foundation
Phase 1  → Authentication
Phase 2  → Project Management
Phase 3  → Task Management
Phase 4  → Milestones, Labels & Comments
Phase 5  → Dashboard & Kanban
Phase 6  → History, Deletion & Restoration
Phase 7  → Testing & Product Polish
Phase 8  → Slack Integration
Phase 9  → AI Agent
Phase 10 → MCP Integration
Phase 11 → Deployment & Production Readiness
```

---

# Phase 0 — Project Foundation

## Goal

Establish the Next.js application, project structure, Supabase connection, environment configuration, and development conventions.

### Tasks

#### 0.1 — Initialize Next.js Application

Already completed.

Verify:

* Next.js application starts
* TypeScript works
* App Router works
* Tailwind works
* Development server works

---

#### 0.2 — Initialize Git Workflow

Already completed.

Verify:

* Git repository exists
* Initial commit exists
* `.gitignore` is appropriate

---

#### 0.3 — Establish Documentation

Create:

```text
docs/
├── PRODUCT.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── DEVELOPMENT_RULES.md
└── CURRENT_STATE.md
```

Verify that the documentation accurately reflects the current product decisions.

---

#### 0.4 — Establish Initial Application Structure

Create the initial folder structure required by the architecture.

Do not create speculative feature files.

Verify:

* Application starts
* Imports resolve correctly
* Structure is understandable

---

#### 0.5 — Create Supabase Project

Create the FlowAgent Supabase project.

Verify:

* Supabase project exists
* PostgreSQL is accessible
* Project credentials are available

---

#### 0.6 — Connect Next.js to Supabase

Configure the required Supabase clients and environment variables.

Verify:

* Local application can communicate with Supabase
* Secrets are not committed to Git
* Connection works correctly

---

#### 0.7 — Establish Database Security Foundation

Before application data is introduced:

* Define the approach for Supabase RLS
* Establish the conventions for protected tables
* Document security assumptions

Do not create unnecessary database policies before the relevant tables exist.

---

# Phase 1 — Authentication

## Goal

Users can securely create accounts, log in, log out, and access authenticated areas of FlowAgent.

### Tasks

#### 1.1 — Configure Supabase Auth

#### 1.2 — Implement Sign Up

#### 1.3 — Implement Login

#### 1.4 — Implement Logout

#### 1.5 — Implement Session Handling

#### 1.6 — Protect Authenticated Routes

#### 1.7 — Create User Profile Representation

#### 1.8 — Verify Authentication Security

Success criteria:

```text
User
 ↓
Sign Up
 ↓
Login
 ↓
Dashboard
 ↓
Refresh
 ↓
Still authenticated
```

---

# Phase 2 — Project Management

## Goal

Users can create and manage projects.

### Tasks

#### 2.1 — Define Project Data Model

Project should support the requirements defined in `PRODUCT.md`.

Key concepts include:

* Name
* Description
* Project key
* Owner
* Creation/update information

---

#### 2.2 — Implement Project Database Schema

Create the required Supabase table(s).

Enable appropriate RLS policies.

---

#### 2.3 — Create Project

User can create a project.

The creation flow should include:

* Name
* Description
* Project key

The creator becomes the project owner.

---

#### 2.4 — List User Projects

Users should only see projects they are authorized to access.

---

#### 2.5 — View Project

Create the project detail page.

---

#### 2.6 — Update Project

Authorized users can update appropriate project information.

---

#### 2.7 — Delete Project

Define and implement project deletion behavior.

This must include appropriate authorization.

---

#### 2.8 — Project Authorization Verification

Verify:

```text
Owner → allowed
Admin → allowed where appropriate
Member → allowed where appropriate
Non-member → denied
```

---

# Phase 3 — Task Management

## Goal

Users can create and manage tasks within projects.

This is one of the most important phases of the application.

### Tasks

#### 3.1 — Define Task Data Model

Task should support:

```text
Identifier
Title
Description
Status
Priority
Assignee
Due Date
Project
Milestone
Creation information
Update information
Deletion state
```

---

#### 3.2 — Implement Task Database Schema

Create the required database structures.

Establish relationships with:

* Projects
* Users
* Milestones where applicable

---

#### 3.3 — Implement Task Identifier Generation

Generate project-specific identifiers.

Examples:

```text
EC-1
EC-2
EC-3
```

Identifiers must remain stable.

---

#### 3.4 — Create Task

Users can create tasks within a project.

---

#### 3.5 — List Tasks

Users can view tasks belonging to projects they can access.

---

#### 3.6 — View Task

Create a task detail representation.

---

#### 3.7 — Update Task

Users can update permitted task properties.

---

#### 3.8 — Delete Task

Implement soft deletion.

Deleted tasks should no longer appear in normal active-task views.

---

#### 3.9 — Task Assignment

A task may be assigned only to a member of the task's project.

Verify that invalid assignments are rejected.

---

#### 3.10 — Task Status

Implement:

```text
Backlog
Todo
In Progress
In Review
Done
```

Allow free movement between statuses.

---

#### 3.11 — Task Priority

Implement:

```text
Low
Medium
High
Urgent
```

---

# Phase 4 — Milestones, Labels & Comments

## Goal

Add the collaboration and organization features around tasks.

### Milestones

#### 4.1 — Create Milestone

#### 4.2 — List Project Milestones

#### 4.3 — Update Milestone

#### 4.4 — Associate Task With Milestone

A task may belong to zero or one milestone.

#### 4.5 — Remove Task From Milestone

---

### Labels

#### 4.6 — Create Project Label

#### 4.7 — Apply Label To Task

#### 4.8 — Remove Label From Task

#### 4.9 — Filter Tasks By Label

---

### Comments

#### 4.10 — Add Comment

#### 4.11 — Display Comments

#### 4.12 — Edit Comment

#### 4.13 — Delete Comment

Authorization rules should be explicitly defined before implementing comment deletion.

---

# Phase 5 — Dashboard & Kanban

## Goal

Turn the underlying project-management capabilities into the main user experience.

### Dashboard

#### 5.1 — Create Dashboard Layout

#### 5.2 — Display User Projects

#### 5.3 — Display Assigned Tasks

#### 5.4 — Display Task Statistics

Include useful metrics such as:

* Total assigned tasks
* In-progress tasks
* Completed tasks
* High-priority tasks
* Upcoming deadlines
* Recently completed work

Avoid unnecessary analytics.

---

### Kanban

#### 5.5 — Create Kanban Board

Columns:

```text
Backlog
Todo
In Progress
In Review
Done
```

#### 5.6 — Display Tasks In Columns

#### 5.7 — Implement Drag and Drop

#### 5.8 — Persist Status Changes

#### 5.9 — Verify Authorization During Drag Operations

Dragging a task must not bypass normal task authorization.

---

# Phase 6 — History, Deletion & Restoration

## Goal

Provide a trustworthy record of important task activity.

### Tasks

#### 6.1 — Define Task History Model

History should capture significant actions.

Examples:

```text
Task created
Task updated
Status changed
Priority changed
Assignee changed
Comment added
Task deleted
Task restored
```

---

#### 6.2 — Record Task Creation

#### 6.3 — Record Task Changes

#### 6.4 — Record Assignment Changes

#### 6.5 — Record Status Changes

#### 6.6 — Record Priority Changes

#### 6.7 — Record Task Deletion

#### 6.8 — Display Task History

#### 6.9 — Display Deleted Tasks

Deleted task history should be accessible to project members according to the product rules.

---

#### 6.10 — Restore Deleted Task

Only project admins can restore a deleted task.

Verify:

```text
Member → cannot restore
Admin → can restore
Non-member → cannot access
```

The original task identifier and history must remain intact.

---

# Phase 7 — Testing & Product Polish

## Goal

Make the application reliable and presentable before adding external integrations.

### Testing

#### 7.1 — Test Authentication

#### 7.2 — Test Project Authorization

#### 7.3 — Test Task Authorization

#### 7.4 — Test Task Assignment Rules

#### 7.5 — Test Status Changes

#### 7.6 — Test Soft Deletion

#### 7.7 — Test Restoration

#### 7.8 — Test History

---

### UI Polish

#### 7.9 — Loading States

#### 7.10 — Empty States

#### 7.11 — Error States

#### 7.12 — Form Validation Feedback

#### 7.13 — Responsive Layout

#### 7.14 — Accessibility Review

#### 7.15 — Consistent Visual Design

---

### Product Checkpoint

At the end of Phase 7:

> FlowAgent must be usable as a standalone project management application without Slack or AI.

This is a major checkpoint.

---

# Phase 8 — Slack Integration

## Goal

Connect FlowAgent to Slack before introducing the LLM.

### Tasks

#### 8.1 — Create Slack Application

#### 8.2 — Configure Slack Permissions

#### 8.3 — Implement Slack Event Endpoint

#### 8.4 — Verify Slack Requests

#### 8.5 — Connect Slack User To FlowAgent User

#### 8.6 — Implement Basic Bot Response

Example:

```text
@FlowAgent hello
```

Response:

```text
Hello! I'm connected to FlowAgent.
```

#### 8.7 — Verify Slack Integration

At the end of this phase:

```text
Slack
 ↓
FlowAgent
 ↓
Response
```

must work reliably.

No AI yet.

---

# Phase 9 — AI Agent

## Goal

Allow users to manage FlowAgent through natural language in Slack.

Groq is the initial LLM provider.

### Stage 1 — Read-only tools

#### 9.1 — Implement `get_my_tasks`

#### 9.2 — Implement `list_tasks`

#### 9.3 — Implement `get_project`

Test natural-language queries.

---

### Stage 2 — Task mutation tools

#### 9.4 — Implement `create_task`

#### 9.5 — Implement `update_task_status`

#### 9.6 — Implement `update_task_priority`

#### 9.7 — Implement `assign_task`

Every tool must enforce normal authorization.

---

### Stage 3 — Project operations

#### 9.8 — Implement `create_project`

#### 9.9 — Implement `invite_member`

The AI must not grant admin privileges.

---

### Stage 4 — AI Safety

#### 9.10 — Authorization Verification

#### 9.11 — Input Validation

#### 9.12 — Tool Error Handling

#### 9.13 — Confirmation For Destructive Operations

#### 9.14 — Prevent Unauthorized Data Access

---

### Stage 5 — Natural Language Quality

Support requests such as:

```text
What tasks do I have?

Show me my high-priority tasks.

Create a task called "Fix login bug" in E-Commerce.

Move EC-42 to In Progress.

Assign EC-42 to Rahul.

What is blocking the E-Commerce project?
```

The agent should gracefully handle ambiguous or unsupported requests instead of guessing.

---

# Phase 10 — MCP Integration

## Goal

Expose selected FlowAgent capabilities through MCP.

MCP is an additional interface to the existing application.

### Tasks

#### 10.1 — Define MCP Tool Contract

#### 10.2 — Implement MCP Server

#### 10.3 — Expose `create_task`

#### 10.4 — Expose `list_tasks`

#### 10.5 — Expose `get_project`

#### 10.6 — Expose `update_task_status`

#### 10.7 — Add Authorization

#### 10.8 — Test MCP Client Interaction

The MCP implementation must reuse existing FlowAgent application capabilities.

---

# Phase 11 — Deployment & Production Readiness

## Goal

Deploy FlowAgent using appropriate free/low-cost infrastructure.

### Tasks

#### 11.1 — Select Deployment Runtime

#### 11.2 — Configure Production Environment Variables

#### 11.3 — Deploy Next.js Application

#### 11.4 — Configure Supabase Production Settings

#### 11.5 — Configure Slack Production Endpoint

#### 11.6 — Configure Groq API

#### 11.7 — Configure MCP Endpoint

#### 11.8 — Production Security Review

#### 11.9 — Production Smoke Tests

#### 11.10 — Create Deployment Documentation

---

# 3. Major Milestones

FlowAgent has four major checkpoints.

## Milestone 1 — Core Foundation

```text
Next.js
+
Supabase
+
Authentication
```

---

## Milestone 2 — Project Management Product

```text
Projects
+
Tasks
+
Milestones
+
Labels
+
Comments
+
Kanban
+
History
```

At this point FlowAgent is a complete standalone project-management application.

---

## Milestone 3 — AI-Powered Slack Interface

```text
Slack
+
Groq
+
AI Tool Calling
+
Authorization
```

At this point users can operate FlowAgent conversationally.

---

## Milestone 4 — MCP-Enabled Agent Platform

```text
Web
+
Slack AI
+
MCP
        ↓
FlowAgent Application Capabilities
        ↓
Supabase
```

This represents the complete product vision.

---

# 4. Development Rules For The Roadmap

The following rules apply throughout development:

### Rule 1 — One task at a time

Never ask an AI coding agent to implement an entire phase.

### Rule 2 — Respect dependencies

Do not implement a feature before its required foundation exists.

### Rule 3 — Verify before moving forward

A task is not complete merely because code was generated.

### Rule 4 — Commit frequently

Each meaningful completed task should result in a Git checkpoint.

### Rule 5 — Update current state

After completing a task, update `CURRENT_STATE.md`.

### Rule 6 — Do not implement future phases

If we are building Projects, do not add Slack or AI because they will eventually need it.

### Rule 7 — Architecture changes require explicit decisions

Do not introduce new infrastructure simply because it might be useful.

### Rule 8 — Preserve working functionality

New features must not unnecessarily break previously verified functionality.

---

# 5. Definition of Done

A roadmap task is considered complete only when:

```text
[ ] Requirements are understood
[ ] Implementation is complete
[ ] Relevant validation exists
[ ] Relevant tests pass
[ ] Manual verification is complete where appropriate
[ ] No unrelated functionality was introduced
[ ] Documentation/state is updated
[ ] Git checkpoint exists
```

---

# 6. Current Position

The Next.js application and Git repository have already been initialized.

Therefore the project begins at:

```text
Phase 0 — Project Foundation
```

Already completed:

```text
✓ Next.js application initialized
✓ Git repository initialized
```

The next development objective is to establish the project documentation and then connect the application to Supabase.
