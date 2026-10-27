# Test Plan: SauceDemo Authentication

**Target:** https://www.saucedemo.com
**Seed:** tests/seed.spec.ts
**Date:** 2026-10-26

## Overview
This test plan covers the authentication workflows on the SauceDemo web application. It validates successful login with standard user credentials, account lock-out error enforcement, input validation on empty fields, and error handling when invalid credentials are provided.

## Preconditions
- Target application is running and accessible at `https://www.saucedemo.com`.
- Test user accounts (`standard_user`, `locked_out_user`) exist in the environment with default password `secret_sauce`.
- Seed test `tests/seed.spec.ts` passes, confirming basic accessibility of username and password fields.

## Scenarios

### Scenario 1.1 — Standard User Successful Authentication
- **Priority:** P0
- **Tags:** @smoke @critical
- **Preconditions:** User is on the login page `https://www.saucedemo.com` with clean session state.
- **Steps:**
  1. Navigate to `https://www.saucedemo.com` — expected: Login page loaded with Username input, Password input, and Login button visible.
  2. Enter `standard_user` into the Username field — expected: Value `standard_user` is populated in the textbox.
  3. Enter `secret_sauce` into the Password field — expected: Password mask characters displayed.
  4. Click the "Login" button — expected: Page navigates to `/inventory.html`.
- **Assertions:**
  - Browser URL equals `https://www.saucedemo.com/inventory.html`.
  - Inventory product catalog contains exactly 6 product cards (`[data-test="inventory-item"]`).
  - Primary title element displaying "Products" is visible.
- **Edge cases considered:** Session persistence after page reload, browser back button navigation after login.

### Scenario 1.2 — Locked Out User Authentication Rejection
- **Priority:** P0
- **Tags:** @smoke @regression
- **Preconditions:** User is on the login page `https://www.saucedemo.com`.
- **Steps:**
  1. Navigate to `https://www.saucedemo.com` — expected: Login inputs are visible.
  2. Enter `locked_out_user` into the Username field — expected: Username is filled.
  3. Enter `secret_sauce` into the Password field — expected: Password is filled.
  4. Click the "Login" button — expected: Navigation is prevented; error container appears.
- **Assertions:**
  - Page URL remains `https://www.saucedemo.com/`.
  - Error banner displays exact text: `Epic sadface: Sorry, this user has been locked out.`.
  - Error icons are displayed in the username and password inputs.
- **Edge cases considered:** Repeated submission attempts with locked user, dismiss button on error banner.

### Scenario 1.3 — Submission With Empty Username Field
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on the login page `https://www.saucedemo.com`.
- **Steps:**
  1. Leave Username field blank.
  2. Enter `secret_sauce` into the Password field — expected: Password field contains masked input.
  3. Click the "Login" button — expected: Navigation blocked; validation error is triggered.
- **Assertions:**
  - Page URL remains `https://www.saucedemo.com/`.
  - Error message is visible with text: `Epic sadface: Username is required`.
- **Edge cases considered:** Whitespace-only username submission, clicking login before touching any input.

### Scenario 1.4 — Submission With Empty Password Field
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on the login page `https://www.saucedemo.com`.
- **Steps:**
  1. Enter `standard_user` into the Username field — expected: Username filled.
  2. Leave Password field empty.
  3. Click the "Login" button — expected: Navigation blocked; validation error is triggered.
- **Assertions:**
  - Page URL remains `https://www.saucedemo.com/`.
  - Error message is visible with text: `Epic sadface: Password is required`.
- **Edge cases considered:** Entering username then blurring, entering password and clearing it.

### Scenario 1.5 — Submission With Invalid Credentials
- **Priority:** P1
- **Tags:** @regression
- **Preconditions:** User is on the login page `https://www.saucedemo.com`.
- **Steps:**
  1. Enter `invalid_user` into the Username field — expected: Username filled.
  2. Enter `wrong_password` into the Password field — expected: Password filled.
  3. Click the "Login" button — expected: Navigation blocked; error banner appears.
- **Assertions:**
  - Page URL remains `https://www.saucedemo.com/`.
  - Error message is visible with text: `Epic sadface: Username and password do not match any user in this service`.
- **Edge cases considered:** Special characters in username/password, SQL injection payload strings.

## Not covered (and why)
- Performance and load testing under high concurrency — out of scope for functional UI end-to-end plan.
- Visual regression testing of inventory imagery — covered in a dedicated visual regression suite.
- Checkout, Cart, and Inventory filtering workflows — planned in separate feature test plans (`saucedemo-checkout.md`, `saucedemo-inventory.md`).
