---
name: playwright-planner
description: Explores a web application using Playwright browser automation and produces a numbered Markdown test plan in specs/. Read-only browser. Never touches code.
---

# Playwright Test Planner (Antigravity Skill)

Use this skill when asked to explore an application and create a comprehensive, numbered Markdown test plan.

## First, read the project rules

1. Read `AGENTS.md` at the project root.
2. Read `tests/seed.spec.ts` — reference baseline test.

## Execution Rules

- Navigate to URLs, hover, wait, press keys.
- Take DOM and accessibility snapshots — this is your primary sense.
- Write plan files exclusively to `specs/<feature-name>.md`.
- Do NOT click destructive buttons (delete, cancel, submit payment).
- Do NOT fill forms with real-looking customer data.
- Do NOT write test code — that is the Generator's responsibility.

## Output Format

Save every plan to `specs/<feature-name>.md` following the numbered format (`1.1`, `1.2`, `2.1`).
Ensure every scenario includes Priority, Tags, Preconditions, Action & Expected Steps, Assertions, and Edge Cases.
