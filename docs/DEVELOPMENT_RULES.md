# FlowAgent — Development Rules

## 1. Purpose

These rules define how FlowAgent is developed with the assistance of AI coding agents.

The purpose is to keep development:

* Controlled
* Incremental
* Understandable
* Verifiable
* Reversible
* Consistent with the product and architecture

AI is an implementation assistant, not the owner of the project's direction.

The human developer remains responsible for architectural decisions, scope, verification, and Git history.

---

# 2. Source of Truth

The following documents define the current project contract:

```text
docs/
├── PRODUCT.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── DEVELOPMENT_RULES.md
└── CURRENT_STATE.md
```

Before making significant changes, the AI should understand the relevant documentation.

### Document responsibilities

**PRODUCT.md**

Defines what FlowAgent is supposed to do.

**ARCHITECTURE.md**

Defines how the system is intended to be structured.

**ROADMAP.md**

Defines what should be built and in what order.

**DEVELOPMENT_RULES.md**

Defines how development should be performed.

**CURRENT_STATE.md**

Defines what has actually been completed and verified.

When documents conflict, stop and ask the human developer for clarification rather than silently choosing an interpretation.

---

# 3. Human Ownership

The human developer owns:

* Product decisions
* Architecture decisions
* Scope decisions
* Technology decisions
* Security decisions
* Git history
* Final verification
* Release decisions

The AI assists with implementation and reasoning but must not independently redefine the project.

---

# 4. One Task At A Time

The AI must work on **one clearly defined roadmap task at a time**.

For example:

```text
Phase 2 — Projects

Current task:
2.3 — Create Project
```

The AI should not automatically implement:

```text
2.4 — List Projects
2.5 — Project Details
2.6 — Update Project
```

unless explicitly instructed to do so.

Completing a task does not give the AI permission to begin every dependent task automatically.

---

# 5. Scope Control

The AI must implement only the requested scope.

If the current task is:

```text
Create Project
```

the AI must not additionally implement:

* Tasks
* Milestones
* Slack
* AI
* MCP
* Notifications
* Analytics

unless explicitly requested.

If the AI identifies a dependency that appears necessary, it should explain the dependency before implementing additional functionality.

---

# 6. Inspect Before Modifying

Before modifying existing code, the AI should inspect the relevant repository structure and existing implementation.

The AI should determine:

* What already exists
* What files are relevant
* What patterns are already being used
* Whether the requested feature already partially exists
* Whether the proposed change conflicts with the architecture

The AI must not overwrite or replace existing functionality simply because another implementation is easier.

---

# 7. Plan Before Coding

For non-trivial tasks, the AI should first provide a concise implementation plan.

The plan should include:

1. What will be changed
2. Which files are expected to change
3. Why those files need to change
4. How the implementation fits the architecture
5. How the change will be tested
6. Anything explicitly out of scope

The AI should wait for approval when the task involves a meaningful architectural decision or ambiguity.

For small, unambiguous changes, the AI may proceed after briefly stating the intended change.

---

# 8. Do Not Invent Requirements

The AI must not assume that unspecified functionality is required.

For example, if a task requires project creation, the AI should not invent:

* Project templates
* Project categories
* Project analytics
* Project notifications
* Public projects

unless those requirements exist in the product specification or are explicitly requested.

When requirements are unclear and the ambiguity affects implementation, ask before proceeding.

---

# 9. Dependencies

Dependencies should be introduced only when they are justified by the current task or architecture.

Before adding a package, the AI should explain:

* Why it is needed
* What problem it solves
* Whether the existing stack can already solve the problem
* Whether it introduces unnecessary complexity

Do not install packages simply because they are commonly used in similar projects.

---

# 10. Architecture Changes

The AI must not independently introduce major architectural changes.

Examples include:

* Adding a new backend service
* Introducing microservices
* Introducing Turborepo
* Adding Redis
* Adding a message queue
* Adding background workers
* Replacing Supabase
* Replacing Next.js
* Introducing a new authentication system
* Changing the database architecture

If such a change appears necessary, the AI should stop and explain:

```text
Current architecture
        ↓
Problem encountered
        ↓
Why current approach is insufficient
        ↓
Proposed change
        ↓
Trade-offs
```

The human developer decides whether the architecture changes.

---

# 11. Business Logic

Business rules should be implemented in reusable application logic rather than duplicated across interfaces.

For example:

```text
Web UI
   ↓
Application Logic
   ↓
Supabase
```

Later:

```text
Slack AI
   ↓
Application Logic
   ↓
Supabase
```

And:

```text
MCP
   ↓
Application Logic
   ↓
Supabase
```

The AI must avoid creating separate implementations of the same business operation for different interfaces.

---

# 12. Authorization

Authorization must be enforced by application logic and appropriate database security.

The AI must never rely on the LLM to determine whether an operation is permitted.

For example:

```text
AI:
"User wants to become admin."

        ↓

Application:
"Does this user have permission?"

        ↓

YES → perform operation
NO  → reject operation
```

AI-generated tool calls must pass through the same authorization rules as normal application operations.

---

# 13. Database Changes

Database schema changes must be intentional.

Before creating or modifying database tables, the AI should understand:

* The product requirement
* Relationships with existing entities
* Required constraints
* Authorization implications
* RLS implications
* Migration implications

Do not create speculative tables for future features.

For example, do not create:

```text
notifications
github_integrations
calendar_events
ai_memory
```

simply because they might be useful later.

---

# 14. Supabase Security

When implementing database-backed features:

* Use appropriate Row Level Security
* Do not expose service-role credentials to the browser
* Keep secrets in environment variables
* Validate authorization server-side
* Do not trust client-provided ownership information
* Do not trust AI-provided authorization information

Security should be considered part of the feature, not a later cleanup task.

---

# 15. Testing

Every implemented task must have an appropriate verification method.

Testing may include:

* Unit tests
* Integration tests
* Database tests
* Authentication tests
* Authorization tests
* Manual browser testing
* API testing

The AI must explain what was tested.

A feature is not considered complete merely because:

```text
npm run build
```

succeeds.

Functional behavior must also be verified where appropriate.

---

# 16. Human Verification

After implementation, the AI should tell the human developer exactly what to verify.

Example:

```text
Please verify:

1. Log in.
2. Open the dashboard.
3. Create a project.
4. Refresh the page.
5. Confirm the project still exists.
6. Try accessing it as a non-member.
```

The AI must distinguish between:

```text
Implemented
```

and:

```text
Verified
```

They are not the same thing.

---

# 17. Git Rules

Git history is owned by the human developer.

## The AI MUST NOT:

* Run `git commit`
* Run `git push`
* Amend commits
* Reset commits
* Rewrite Git history
* Create tags
* Automatically create Git checkpoints

The AI may inspect Git information when necessary.

The AI may suggest a commit message.

---

# 18. Manual Commit Checkpoint

After a phase has been fully implemented and tested, the AI must stop and ask the human developer to manually create the Git checkpoint.

Example:

```text
Phase 2 — Projects is complete.

All Phase 2 tests have passed and the feature has been
manually verified.

Please manually commit the changes before we proceed
to Phase 3.

Suggested commit message:

feat: complete project management
```

The AI must not execute the commit.

The AI should wait for confirmation that the checkpoint has been created before treating the phase as closed.

---

# 19. Git Checkpoints

The project should maintain meaningful checkpoints.

Example:

```text
Initial Next.js setup
        ↓
Phase 0 complete
        ↓
Phase 1 complete
        ↓
Phase 2 complete
        ↓
Phase 3 complete
```

These checkpoints allow the project to be understood and recovered easily.

---

# 20. CURRENT_STATE.md

After a task is verified, `CURRENT_STATE.md` should be updated.

It should record:

* Current phase
* Completed tasks
* Verified functionality
* Current task
* Known issues
* Next task

The AI may propose the required update, but the human developer should review it before considering the state finalized.

---

# 21. Handling Unexpected Problems

If the AI encounters a problem that requires changing the scope:

Do not silently expand the implementation.

Instead:

```text
Problem
   ↓
Explain
   ↓
Identify possible solutions
   ↓
Explain trade-offs
   ↓
Ask human developer
   ↓
Proceed only after decision
```

---

# 22. No "While We're Here" Development

The AI must not modify unrelated code simply because it notices an opportunity to improve it.

Examples:

```text
Current task:
Create Project

AI notices:
"Task architecture could be improved."

Action:
Do not modify task architecture.
```

Unrelated improvements should be recorded as future work if useful.

---

# 23. Refactoring

Refactoring should happen when:

* It is required for the current feature
* Existing code creates a real problem
* The refactor has a clearly defined scope

Large refactors require explicit approval.

Do not refactor the entire application simply because a new pattern is preferred.

---

# 24. Error Handling

Features should handle expected failure cases.

Examples:

* Invalid input
* Unauthorized access
* Missing records
* Database errors
* External service failures

Do not hide errors simply to make tests pass.

Errors should be handled intentionally and provide useful feedback.

---

# 25. Documentation Updates

Documentation should be updated when an implementation changes a documented decision.

For example:

```text
Architecture decision changes
        ↓
Update ARCHITECTURE.md
```

```text
Roadmap changes
        ↓
Update ROADMAP.md
```

```text
Current implementation changes
        ↓
Update CURRENT_STATE.md
```

Do not allow documentation and implementation to drift apart.

---

# 26. AI Response Format

For significant development tasks, the AI should structure its response as:

```text
## Understanding

What I understand the task to be.

## Plan

What I intend to change.

## Scope

What is included and excluded.

## Implementation

What was changed.

## Verification

What was tested.

## Files Changed

Relevant files that were modified.

## Current State

What is now complete.

## Next Step

The next roadmap task, without implementing it.
```

The AI should keep the report concise enough to remain useful.

---

# 27. Stop Conditions

The AI must stop when:

* The requested task is complete
* Tests have been run
* The result has been reported
* Human verification is required
* A significant architectural decision is required
* The requested scope has been reached

The AI must not continue building future functionality automatically.

---

# 28. Phase Completion

A phase is complete only when:

```text
[ ] All phase tasks are implemented
[ ] Relevant tests pass
[ ] Manual verification is complete
[ ] Known issues are documented
[ ] CURRENT_STATE.md is updated
[ ] Human has reviewed the result
[ ] Human manually creates the Git commit
```

Only after these conditions are satisfied should the project move to the next phase.

---

# 29. Core Principle

The project should always remain understandable to the human developer.

The AI should optimize for:

```text
Clarity
+
Small changes
+
Explicit decisions
+
Verification
+
Recoverability
```

rather than:

```text
Maximum automation
+
Maximum code
+
Maximum features
```

The goal is not to have the AI build FlowAgent as quickly as possible.

The goal is to build FlowAgent **deliberately, understand every major decision, and maintain control of the project throughout development.**
