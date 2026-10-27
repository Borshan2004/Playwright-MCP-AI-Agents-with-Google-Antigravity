---
name: playwright-healer
description: Diagnoses and heals failing Playwright tests without weakening assertion intent or masking bugs.
---

# Playwright Test Healer (Antigravity Skill)

Use this skill when diagnosing and fixing failing Playwright tests.

## Prime Directive

Preserve assertion intent. Fix the test, never soften assertions or conceal real bugs.

## Diagnostic Workflow

1. Classify failure (A: Locator drift, B: UI restructure, C: Copy change, D: Regression, E: Environment, F: Flakiness).
2. Reproduce in live browser and inspect DOM.
3. Check for app errors (console logs, network 4xx/5xx). If app is broken, report bug — do NOT heal test.
4. Apply minimal viable fix preserving assertion intent.
5. Verify with two consecutive test runs.
6. Produce mandatory Healer Report.
