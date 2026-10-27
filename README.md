# Playwright MCP & AI Agents with Google Antigravity

A complete, copy-paste-ready guide to setting up and running **Playwright MCP** with **Google Antigravity** using the three autonomous AI testing agents: **Planner**, **Generator**, and **Healer**.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step Setup from Scratch](#2-step-by-step-setup-from-scratch)
   - [Step 1: Initialize Project & Dependencies](#step-1-initialize-project--dependencies)
   - [Step 2: Initialize Playwright Agent Definitions](#step-2-initialize-playwright-agent-definitions)
   - [Step 3: Configure Antigravity MCP Server](#step-3-configure-antigravity-mcp-server)
   - [Step 4: Configure Project Rulebooks (AGENTS.md & GEMINI.md)](#step-4-configure-project-rulebooks)
   - [Step 5: Setup Antigravity Native Skills](#step-5-setup-antigravity-native-skills)
   - [Step 6: Setup Page Object & Test Infrastructure](#step-6-setup-page-object--test-infrastructure)
3. [How to Use the 3 Agents in Antigravity](#3-how-to-use-the-3-agents-in-antigravity)
4. [Cloning & Reusing on Another PC (Zero Setup)](#4-cloning--reusing-on-another-pc-zero-setup)

---

## 1. Prerequisites

Before starting, ensure you have:
- **Node.js 18+** (`node --version`)
- **npm** (`npm --version`)
- **Google Antigravity** installed and running on your machine.

---

## 2. Step-by-Step Setup from Scratch

### Step 1: Initialize Project & Dependencies

In your project terminal (PowerShell or Bash):

```bash
# 1. Initialize package.json
npm init -y

# 2. Install Playwright test runner and TypeScript definitions
npm install -D @playwright/test typescript @types/node

# 3. Install browser binaries (Chromium)
npx playwright install chromium
```

---

### Step 2: Initialize Playwright Agent Definitions

Run Playwright's built-in agent initializer:

```bash
npx playwright init-agents --loop=vscode
```

This creates baseline starter templates:
- `specs/README.md`
- `tests/seed.spec.ts`
- `.github/agents/playwright-test-*.agent.md`
- `.vscode/mcp.json`

---

### Step 3: Configure Antigravity MCP Server

Create `mcp_config.json` at the root and copy it to `.agents/mcp_config.json`:

**File: `mcp_config.json` & `.agents/mcp_config.json`**
```json
{
  "mcpServers": {
    "playwright-test": {
      "command": "npx",
      "args": [
        "playwright",
        "run-test-mcp-server"
      ]
    }
  }
}
```

> **Why this matters:** Antigravity automatically detects this file and starts the Playwright MCP server process in the background. You **never** need to manually click "Start Server".

---

### Step 4: Configure Project Rulebooks

Antigravity automatically discovers and loads `AGENTS.md` and `GEMINI.md` into the model's context on every interaction.

Create `AGENTS.md` at the project root (and copy to `GEMINI.md` and `.github/copilot-instructions.md`):

**File: `AGENTS.md`**
```markdown
# Project rules for AI agents

You are working in a Playwright TypeScript automation project.
Follow these rules for every code change.

## Stack
- Playwright 1.56+ with TypeScript
- Node 20+
- Test runner: @playwright/test

## Folder structure
- `src/pages/` — Page Object classes (one file per page)
- `src/fixtures/` — Custom fixtures extending base test
- `src/utils/` — Pure helpers, no test logic
- `tests/` — Spec files, mirror app URL structure
- `tests/data/` — JSON/CSV test data
- `specs/` — Planner output (Markdown plans)

## Coding conventions
- Import test and expect from `src/fixtures/base.ts`, never from `@playwright/test` directly
- Use `test.describe` per feature area
- One logical assertion group per test
- File names: kebab-case (`add-to-cart.spec.ts`)

## Locator priority (STRICT — do not deviate)
1. `getByRole` with accessible name
2. `getByLabel` for form fields
3. `getByTestId` (attribute is `data-test-id` or configured testIdAttribute)
4. `getByText` only for genuinely static UI text
5. CSS / XPath — forbidden unless approved

## Page Object contract
- One class per page, extends `BasePage`
- Constructor takes `page: Page` only
- All locators declared as `readonly` in constructor
- Action methods return `Promise<void>` OR the next page object
- No `expect()` calls inside page objects — assertions belong in tests

## Assertion rules
- Web-first assertions only (`expect(locator).toBeVisible()`)
- No `page.waitForTimeout` — ever
- No `waitForSelector` — use locator auto-waiting
```

---

### Step 5: Setup Antigravity Native Skills

Create `.agents/skills/` so Antigravity recognizes the 3 roles as workspace skills:

1. **`.agents/skills/playwright-planner/SKILL.md`**:
```markdown
---
name: playwright-planner
description: Explores a web application using Playwright browser automation and produces a numbered Markdown test plan in specs/. Read-only browser. Never touches code.
---
# Playwright Test Planner
Follow AGENTS.md. Read-only browser. Save plans to specs/<feature-name>.md.
```

2. **`.agents/skills/playwright-generator/SKILL.md`**:
```markdown
---
name: playwright-generator
description: Turns a plan scenario from specs/ into a runnable Playwright TypeScript spec following strict Page Object and locator conventions.
---
# Playwright Test Generator
Follow AGENTS.md. Import test/expect from src/fixtures/base.ts. Page objects extend BasePage. Run and verify tests.
```

3. **`.agents/skills/playwright-healer/SKILL.md`**:
```markdown
---
name: playwright-healer
description: Diagnoses and heals failing Playwright tests without weakening assertion intent or masking bugs.
---
# Playwright Test Healer
Follow AGENTS.md. Never weaken assertions. Verify root cause. Run test twice after fix. Output Healer Report.
```

---

### Step 6: Setup Page Object & Test Infrastructure

#### 1. Playwright Configuration (`playwright.config.ts`)
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

#### 2. Base Fixture (`src/fixtures/base.ts`)
```typescript
import { test as base, expect } from '@playwright/test';

export const test = base.extend<{}>({});
export { expect };
```

#### 3. Base Page Object (`src/pages/BasePage.ts`)
```typescript
import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract goto(): Promise<void>;

  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

#### 4. Baseline Seed Test (`tests/seed.spec.ts`)
```typescript
import { test, expect } from '../src/fixtures/base';

test.describe('Seed — environment baseline @smoke', () => {
  test('SauceDemo login page loads', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  });
});
```

#### 5. Verify the Baseline
```bash
npx playwright test tests/seed.spec.ts
```

---

## 3. How to Use the 3 Agents in Antigravity

In Antigravity, you do **not** select chat modes or click "start server". Just type your prompt:

### Role 1: Planner
```text
Act as the Playwright Test Planner.
Explore https://www.saucedemo.com with standard_user / secret_sauce.
Cover the login flow and save the numbered plan to specs/saucedemo-login.md.
```

### Role 2: Generator
```text
Act as the Playwright Test Generator.
Generate a test for Scenario 1.1 from specs/saucedemo-login.md.
Create LoginPage at src/pages/LoginPage.ts and InventoryPage at src/pages/InventoryPage.ts.
Generate test at tests/auth/standard-login.spec.ts, run it, and confirm it passes.
```

### Role 3: Healer
```text
Act as the Playwright Test Healer.
The test tests/auth/standard-login.spec.ts is failing.
Diagnose root cause, apply minimal-viable fix without softening assertions, run twice to verify, and output the Healer Report.
```

---

## 4. Cloning & Reusing on Another PC (Zero Setup)

### Can you push this repo to GitHub and use it on another PC without repeating these steps?

**YES! 100%.**

Because all configurations (`mcp_config.json`, `AGENTS.md`, `GEMINI.md`, `.agents/skills`, `.github/agents`, `playwright.config.ts`, `src/`, `tests/`) are committed to version control, any PC cloning this repository is **immediately ready**.

### When you clone on a new PC, run only two commands:

```bash
# 1. Clone repository
git clone <your-repo-url>
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Install browser binaries
npx playwright install chromium
```

That is all! Open the project folder in Antigravity, and all tools, rules, skills, and MCP automation work out-of-the-box.
