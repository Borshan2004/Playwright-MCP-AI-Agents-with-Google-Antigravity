---
name: playwright-generator
description: Turns a plan scenario from specs/ into a runnable Playwright TypeScript spec following strict Page Object and locator conventions.
---

# Playwright Test Generator (Antigravity Skill)

Use this skill when turning a test plan scenario into clean, runnable Playwright TypeScript specs.

## Framework Rules

1. Read `AGENTS.md` and `tests/seed.spec.ts`.
2. Import `test` and `expect` from `src/fixtures/base.ts` — NEVER from `@playwright/test` directly.
3. Import page objects from `src/pages/` and test data from `tests/data/`.
4. Page objects must extend `BasePage` and have readonly locators initialized in constructor.
5. Locator priority: `getByRole` > `getByLabel` > `getByTestId` > `getByText`. CSS and XPath are forbidden.
6. Web-first assertions only (`toBeVisible()`, `toHaveCount()`, `toHaveText()`). Never use `page.waitForTimeout`.
7. Verify locators in a browser before writing code.
8. Run the test with `npx playwright test <path>` and confirm it passes.
