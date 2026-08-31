# FlowAgent — Architecture

## 1. Architecture Overview

FlowAgent is initially implemented as a **standalone full-stack Next.js application**.

The application follows a modular-monolith architecture.

The web application, authentication, project-management logic, Slack integration, AI agent, and eventual MCP integration live within the same overall application initially.

The system is intentionally designed so that different interfaces can use the same underlying application capabilities.

```text
                         FLOWAGENT

                    Next.js Application
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
       Web UI         Slack / AI*          MCP*
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                  Application Logic
                           │
                           ▼
                        Supabase
                   ┌───────┼────────┐
                   ▼       ▼        ▼
              PostgreSQL   Auth   Storage*
```

`*` Slack, AI, and MCP are introduced in later development phases.

---

# 2. Architectural Principles

FlowAgent follows these principles:

### 2.1 Modular Monolith

The application starts as one deployable Next.js application.

We do not introduce microservices, multiple applications, or a monorepo unless a concrete requirement justifies them.

### 2.2 Business Logic Is Reusable

Project-management operations should not be implemented separately for the web interface, Slack agent, and MCP.

The underlying application capabilities should be reusable.

Conceptually:

```text
Web UI ────────────┐
                   │
Slack AI ──────────┼──→ Application Capability
                   │
MCP ───────────────┘
                           │
                           ▼
                        Supabase
```

For example:

```text
createTask()
```

should represent the application's task-creation capability.

The web interface, AI tools, and MCP tools can eventually invoke the same underlying capability.

### 2.3 Security Is Not Delegated to AI

The AI agent is never responsible for deciding whether an action is authorized.

The application enforces authorization.

```text
Request
   ↓
Authenticate user
   ↓
Check project permissions
   ↓
Validate operation
   ↓
Execute operation
```

AI can interpret natural language, but it cannot bypass application permissions.

### 2.4 Database Security Is Defense in Depth

Application-level authorization is combined with Supabase PostgreSQL Row Level Security (RLS).

```text
Application Authorization
          +
Supabase RLS
          ↓
       Database
```

Both layers should contribute to protecting project and task data.

### 2.5 Avoid Premature Infrastructure

The initial architecture does not introduce infrastructure without a demonstrated requirement.

Not initially required:

* Redis
* Message queues
* Background workers
* Microservices
* Kubernetes
* Separate backend service
* Turborepo
* Dedicated AI service

These may be considered later if the system genuinely requires them.

---

# 3. Technology Stack

## Application

* Next.js
* TypeScript
* App Router

Next.js provides both the user interface and server-side application capabilities.

## Database and Backend Services

Supabase provides:

* PostgreSQL
* Authentication
* Optional Storage when a real requirement appears

## Validation

Zod is used for validating user input and structured application data where appropriate.

## UI

* Tailwind CSS
* shadcn/ui

The UI should use a consistent component system without introducing unnecessary abstraction.

## AI

Groq is the initial LLM provider.

The AI layer should be designed so the underlying provider can be replaced later without rewriting the entire application.

## Slack

Slack's APIs and JavaScript tooling will be used for the Slack integration.

## MCP

MCP will be introduced after the core application capabilities are stable.

The official TypeScript MCP SDK will be evaluated/used during the MCP implementation phase.

---

# 4. Application Layers

The application is conceptually divided into several responsibilities.

```text
Presentation
     ↓
Application / Feature Logic
     ↓
Data Access
     ↓
Supabase
```

## 4.1 Presentation Layer

Responsible for:

* Pages
* Layouts
* React components
* Forms
* User interactions
* Loading states
* Error states

The presentation layer should not contain complex business rules.

---

## 4.2 Application / Feature Logic

Responsible for:

* Project operations
* Task operations
* Membership operations
* Milestone operations
* Comment operations
* Label operations
* Authorization checks
* Business rules

Examples:

```text
createProject()
createTask()
updateTask()
deleteTask()
restoreTask()
assignTask()
updateTaskStatus()
createMilestone()
inviteMember()
```

The exact implementation may evolve as the application is built.

---

## 4.3 Data Access

Responsible for communication with Supabase.

Examples:

```text
Read projects
Create task
Update task
Fetch project members
Fetch task history
```

Database access should be kept out of presentation components wherever practical.

---

# 5. Next.js Responsibilities

Next.js is the primary application runtime.

It is responsible for:

* Rendering the web application
* Server-side application logic
* Server Actions
* Route Handlers
* Authentication integration
* External webhook endpoints
* Eventually AI and Slack orchestration

---

# 6. Server Actions vs Route Handlers

FlowAgent does not require a REST endpoint for every operation.

## Server Actions

Server Actions are preferred for operations initiated directly by the FlowAgent web application where an HTTP API is not otherwise required.

Example:

```text
Create Project Form
       ↓
Server Action
       ↓
Project Logic
       ↓
Supabase
```

## Route Handlers

Route Handlers are used when FlowAgent needs to expose an HTTP endpoint to an external system.

Examples:

```text
Slack
  ↓
POST /api/slack/events
```

Later:

```text
MCP Client
  ↓
MCP endpoint
```

The decision should be based on the caller and use case rather than forcing every feature into one pattern.

---

# 7. Authentication

Supabase Auth is the initial authentication system.

Conceptually:

```text
User
 ↓
Sign Up / Login
 ↓
Supabase Auth
 ↓
Authenticated Session
 ↓
FlowAgent Application
```

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do?

These responsibilities must remain distinct.

---

# 8. Authorization

FlowAgent uses project-level authorization.

Each project has:

* One owner
* Zero or more administrators
* Zero or more members

Users may belong to multiple projects.

A user's permissions are determined by their membership and role within the specific project.

Example:

```text
Project A

Abhinandan → Owner
Rahul      → Admin
Priya      → Member
```

The same user can have a different role in another project.

Authorization must be enforced for:

* Web actions
* Server-side operations
* Slack AI actions
* MCP actions

No interface is allowed to bypass authorization.

---

# 9. Project Visibility

Projects are **private by default**.

Only users who are members of a project can access its project data.

Conceptually:

```text
Project
   │
   ├── Owner
   ├── Admins
   └── Members
```

Users who are not members cannot access the project's tasks, milestones, comments, or other private project information.

Public projects are not part of the initial product.

---

# 10. Task Assignment Rules

A task may be unassigned.

If a task has an assignee, the assignee must be a member of the task's project.

Example:

```text
Project A
├── Rahul
├── Priya
└── Arjun

Task
└── Assigned to Rahul ✅
```

But:

```text
Project A
├── Rahul
└── Priya

Task
└── Assigned to John ❌
```

The application must enforce this rule.

---

# 11. Task Status

FlowAgent provides five standard statuses:

```text
Backlog
Todo
In Progress
In Review
Done
```

Tasks can move freely between these statuses.

For example:

```text
Backlog → Done
```

is allowed.

The system should not enforce a mandatory sequence.

Status changes are recorded in task history.

---

# 12. Milestones

A task can belong to **zero or one milestone**.

```text
Project
│
├── Milestone A
│     ├── Task 1
│     └── Task 2
│
├── Milestone B
│     └── Task 3
│
└── Task 4
```

Task 4 does not belong to a milestone.

A task cannot belong to multiple milestones simultaneously.

Milestones belong to a project.

A task can only be assigned to a milestone belonging to the same project.

---

# 13. Task Deletion and Restoration

Tasks use soft deletion.

When a task is deleted:

```text
Active Task
    ↓
Soft Deleted
    ↓
Removed from normal task views
    ↓
Retained in project history
```

The task's:

* Identifier
* Data
* Comments
* Change history

are retained.

Deleted tasks remain visible in the project's history/deleted-items area.

All project members can view deleted-task history.

Project admins can restore deleted tasks.

Restoration does not create a new task or identifier.

Example:

```text
EC-42
   ↓
Deleted
   ↓
Restored
   ↓
EC-42
```

The original history remains intact.

---

# 14. Task History

Significant task events are recorded.

Examples:

```text
Task created
Task assigned
Task unassigned
Status changed
Priority changed
Description changed
Comment added
Task deleted
Task restored
```

Each history entry should record:

* Actor
* Action
* Relevant change
* Timestamp

The history provides an auditable record of important task activity.

---

# 15. Task Identifiers

Tasks use project-specific human-readable identifiers.

Example:

```text
EC-1
EC-2
EC-3
```

The project key is selected when the project is created.

The numeric portion increments for new tasks within the project.

Task identifiers remain stable after:

* Status changes
* Assignment changes
* Priority changes
* Deletion
* Restoration

---

# 16. Feature Structure

The application should be organized around business capabilities rather than technical categories alone.

A target structure may resemble:

```text
flowagent/
│
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── projects/
│   └── api/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── projects/
│   ├── tasks/
│   ├── milestones/
│   ├── comments/
│   ├── labels/
│   └── members/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   └── validation/
│
├── docs/
│
└── ...
```

This is a **target structure**, not a requirement to create every directory immediately.

Files and directories should be introduced when their corresponding feature is implemented.

---

# 17. Supabase Architecture

Supabase provides the primary persistence and authentication infrastructure.

Conceptually:

```text
                 Supabase
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   PostgreSQL      Auth       Storage*
```

The initial application primarily uses:

```text
PostgreSQL
Auth
```

Storage is reserved for future features that actually require file uploads.

---

# 18. Row Level Security

Supabase PostgreSQL RLS should be enabled for application tables containing user/project data.

The policies should reflect project membership and ownership.

Conceptually:

```text
User
 │
 ▼
Project Membership
 │
 ├── Owner
 ├── Admin
 └── Member
 │
 ▼
Allowed project data
```

RLS policies must prevent users from reading or modifying projects and tasks to which they do not have access.

The exact SQL policies will be designed alongside the database schema.

---

# 19. Slack Architecture

Slack is a later interface to the FlowAgent application.

Conceptually:

```text
Slack
  ↓
Slack Event
  ↓
Next.js Route Handler
  ↓
AI Agent
  ↓
Tool
  ↓
Application Logic
  ↓
Supabase
```

The Slack integration must authenticate/verify incoming Slack requests and associate actions with the correct FlowAgent user.

The AI agent must operate using the permissions of the requesting user.

---

# 20. AI Agent Architecture

The AI agent is responsible for interpreting natural-language requests and selecting appropriate tools.

Example:

```text
User:
@FlowAgent move EC-42 to In Progress

        ↓

AI Agent

        ↓

update_task_status(
    task="EC-42",
    status="in_progress"
)

        ↓

Application Logic

        ↓

Authorization

        ↓

Supabase
```

The LLM does not directly manipulate the database.

The AI should interact with FlowAgent through controlled tools.

---

# 21. AI Tool Architecture

Potential tools include:

```text
get_my_tasks
list_tasks
get_project
create_project
create_task
update_task
update_task_status
update_task_priority
assign_task
create_comment
invite_member
```

The tool set should be introduced incrementally.

Every tool must:

1. Validate its input.
2. Identify the requesting user.
3. Check authorization.
4. Execute the appropriate application operation.
5. Return a controlled result.

The LLM itself should never be trusted with authorization decisions.

---

# 22. MCP Architecture

MCP is introduced after the core application capabilities are stable.

The intended architecture is:

```text
MCP Client
    ↓
MCP Server
    ↓
FlowAgent Tools
    ↓
Application Logic
    ↓
Supabase
```

MCP tools should reuse existing FlowAgent capabilities.

For example:

```text
MCP create_task
       ↓
createTask()
       ↓
Supabase
```

MCP should not implement a second task-management system.

Initially, the MCP layer may live within the same Next.js application. A separate MCP deployment should only be introduced if there is a concrete operational requirement.

---

# 23. AI Provider Abstraction

Groq is the initial LLM provider.

The architecture should avoid tightly coupling all business logic to Groq-specific APIs.

Conceptually:

```text
AI Agent
   ↓
AI Provider Interface
   ↓
Groq
```

This allows the provider to be changed later if required.

The application should not require a major rewrite merely because the LLM provider changes.

---

# 24. Deployment Architecture

The initial target is a low-cost/free-tier deployment.

The desired starting architecture is:

```text
             Internet
                │
                ▼
          Next.js Application
                │
                ▼
             Supabase
                │
                ▼
             PostgreSQL
```

AI requests use:

```text
Next.js
   ↓
Groq API
```

Slack uses:

```text
Slack
   ↓
Next.js
```

The final hosting provider and runtime configuration will be selected after the Slack/AI requirements are implemented and tested.

The architecture should not assume that every operation can be handled as a long-running request.

---

# 25. Observability and Error Handling

The application should provide clear handling for:

* Authentication failures
* Authorization failures
* Validation errors
* Database errors
* External API failures
* AI failures
* Slack failures

User-facing errors should be understandable.

Internal errors should be logged appropriately without exposing sensitive implementation details.

Detailed observability will be added progressively rather than introducing a large monitoring stack prematurely.

---

# 26. Testing Strategy

Testing will be introduced progressively.

Priority areas include:

### Business Logic

Test operations such as:

```text
createTask()
updateTaskStatus()
assignTask()
deleteTask()
restoreTask()
```

### Authorization

Verify that:

```text
Member cannot grant admin
Non-member cannot access project
Task cannot be assigned outside project
Admin can restore deleted task
```

### AI Tools

Verify that AI tools respect the same authorization rules as the web application.

### UI

Test important user flows such as:

```text
Sign up
Create project
Create task
Move task
Delete task
Restore task
```

The exact testing tools and coverage targets will be determined during the implementation phase.

---

# 27. Architectural Evolution

The architecture is intentionally allowed to evolve.

The initial system is:

```text
One Next.js application
        +
Supabase
```

If real requirements emerge, additional components can be introduced.

For example:

```text
Next.js
   +
Background Worker
```

or:

```text
Next.js
   +
Separate MCP Server
```

or:

```text
Monorepo
```

However, such changes require a concrete reason and should be documented before implementation.

---

# 28. Architecture Decision Summary

| Decision                 | Choice                           |
| ------------------------ | -------------------------------- |
| Application architecture | Modular monolith                 |
| Main framework           | Next.js                          |
| Language                 | TypeScript                       |
| Frontend/backend         | Same Next.js application         |
| Database                 | Supabase PostgreSQL              |
| Authentication           | Supabase Auth                    |
| Database security        | Supabase RLS                     |
| Validation               | Zod                              |
| UI                       | Tailwind + shadcn/ui             |
| ORM                      | None initially                   |
| Database client          | Supabase client                  |
| Web mutations            | Server Actions where appropriate |
| External integrations    | Route Handlers where appropriate |
| AI provider              | Groq initially                   |
| Slack                    | Slack API / JavaScript tooling   |
| MCP                      | Later                            |
| Monorepo/Turborepo       | Not initially                    |
| Microservices            | Not initially                    |
| Redis/queues/workers     | Not initially                    |
| Project visibility       | Private                          |
| Task assignment          | Project members only             |
| Task status              | Free movement                    |
| Milestone relationship   | Zero or one per task             |
| Task deletion            | Soft delete                      |
| Deleted-task restoration | Admin only                       |
| Task history             | Retained                         |
