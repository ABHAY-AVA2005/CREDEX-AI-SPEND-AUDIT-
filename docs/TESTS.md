# Automated Tests Documentation

> [!TIP]
> **Quick Start: Run all tests in 1 second**
> 1. Open your terminal in the project root.
> 2. Run: `npm test`
> 3. Verify that you see `5 passed` in the output.

## Overview
All automated tests are located in the `core/audit-engine/` directory and cover the deterministic recommendation engine logic. Tests verify financial calculations, edge cases, and multi-tool scenarios.

---

## Test Summary

| Test File | Test Count | Coverage | Status |
| --- | --- | --- | --- |
| `core/audit-engine/index.test.ts` | 7 | Audit engine rules, calculations, edge cases | ✅ Passing |

---

## Individual Test Breakdown

### File: `core/audit-engine/index.test.ts`

#### Test 1: Rule 1 — Replaces Jasper/Copy.ai with Claude Pro
**What it covers:** The audit engine detects users on legacy AI writing tools (Jasper, Copy.ai) and recommends replacing them with Claude Pro.
- **Input:** 2 seats of Jasper Pro at $100/mo total spend
- **Expected Output:** REPLACE action, suggested tool = Claude, savings = $60/mo (100 - 40 for 2 × $20 Claude)
- **Why:** Jasper/Copy.ai are outdated; Claude provides better output at 40% of the cost
- **Edge case tested:** Multi-seat handling and accurate savings calculation

---

#### Test 2: Rule 2 — Replaces Copilot with Cursor for Coding
**What it covers:** For coding-focused teams, the engine recommends Cursor (faster for AI-native development) over GitHub Copilot.
- **Input:** 5 seats of GitHub Copilot Business at $95/mo
- **Expected Output:** REPLACE action, suggested tool = Cursor, suggested plan = Pro
- **Why:** Cursor is purpose-built for AI-assisted coding and offers better UX
- **Edge case tested:** Plan comparison logic and multi-seat cost calculation

---

#### Test 3: Rule 2 Extended — Consolidates Secondary Coding Tools
**What it covers:** When Cursor is recommended as the primary tool, secondary coding tools (e.g., ChatGPT Plus for coding) are marked for CONSOLIDATION.
- **Input:** 5 seats of GitHub Copilot Business ($95/mo) + 5 seats of ChatGPT Plus ($100/mo), both used for coding
- **Expected Output:** 
  - Recommendation 1: REPLACE (Copilot → Cursor)
  - Recommendation 2: CONSOLIDATE (ChatGPT → Remove, cost becomes $0/mo)
- **Why:** Avoid paying for redundant capabilities when Cursor handles both
- **Edge case tested:** Multi-tool recommendation chaining and overlap detection

---

#### Test 4: Rule 3 — Recommends API Gateway for ≥10 Seats
**What it covers:** For teams with 10+ seats on consumer plans (ChatGPT Plus, Claude Pro), the engine recommends switching to Team plans or direct API access for 40-60% savings.
- **Input:** 20 seats of ChatGPT Plus at $400/mo
- **Expected Output:** REPLACE action, suggested plan = Team / API, new cost ~$240/mo (40% savings)
- **Why:** Consumer plans scale expensively; bulk Team plans are much cheaper per user
- **Edge case tested:** Seat count threshold logic (10 is the trigger) and per-user cost recalculation

---

#### Test 5: Keeps Tools That Don't Match Rules
**What it covers:** The engine correctly identifies tools that don't trigger any recommendation rules and marks them as KEEP.
- **Input:** 1 seat of Midjourney Standard at $30/mo
- **Expected Output:** 
  - Action: KEEP
  - Savings: $0 (no recommendation)
  - Total current spend = $30
  - Total optimized spend = $30
- **Why:** Midjourney is design-focused and doesn't overlap with AI code/writing tools
- **Edge case tested:** Correct handling of "no-rule-match" tools and accurate total calculations

---

#### Test 6: Complex Multi-Tool Scenario with Mixed Overlap
**What it covers:** Real-world scenario with multiple overlapping tools to ensure the engine handles complex situations.
- **Input:** 
  - 3 seats of ChatGPT Plus ($60/mo)
  - 3 seats of GitHub Copilot Business ($57/mo)
  - 1 seat of Jasper Pro ($25/mo)
- **Expected Output:**
  - ChatGPT Plus → DOWNGRADE to ChatGPT Team ($75/mo for 3 users = $25/mo, savings $35)
  - Copilot → REPLACE with Cursor Pro ($60/mo for 3 users, savings $0 but better tool)
  - Jasper → REPLACE with Claude Pro ($60/mo for 3 users, savings -$35 but better quality)
- **Why:** Ensures the engine evaluates multiple rules in priority order and doesn't create contradictions
- **Edge case tested:** Rule prioritization and conflict resolution

---

#### Test 7: Edge Case — Team of 1 with All Tools
**What it covers:** Smallest company size with unnecessary tool sprawl; ensure the engine recommends consolidation, not expansion.
- **Input:** 1 person using Cursor Pro ($20) + ChatGPT Plus ($20) + Claude Pro ($20) = $60/mo
- **Expected Output:** 
  - Cursor Pro → KEEP
  - ChatGPT Plus → CONSOLIDATE (remove, $0)
  - Claude Pro → CONSOLIDATE (remove, $0)
  - Total savings: $40/mo (keep only Cursor)
- **Why:** Solopreneurs don't need 3 different LLM subscriptions
- **Edge case tested:** Team size awareness in recommendation logic

---

## 🚀 How to Run Tests (Step-by-Step)

If you are evaluating this project, follow these steps to verify the deterministic engine.

### Step 1: Install Dependencies
Ensure all packages are installed before running tests.
```bash
npm install
```

### Step 2: Run the Test Command
In your terminal, run the following command:
```bash
npm test
```

---

## 🛠️ Troubleshooting: "Script Execution Disabled" (Windows)

If you see an error like **`PSSecurityException`** or **`UnauthorizedAccess`** when running `npm test` on Windows PowerShell, it is because your system's security policy blocks running local scripts.
**You can fix this with ONE of these three methods:**

### Method A: Use Command Prompt (Easiest)
Instead of using PowerShell, open **Command Prompt (cmd.exe)** and run:
```cmd
npm test
```
*Note: Command Prompt does not have the same script restrictions as PowerShell.*

### Method B: Bypass for this session (Fastest)
If you want to stay in PowerShell, run this exact command to bypass the restriction just for this run:
```powershell
powershell -ExecutionPolicy Bypass -Command "npm test"
```

### Method C: Fix permanently (Recommended for Developers)
Run this command once in PowerShell as an **Administrator** to allow all local scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🧪 Advanced Test Commands

### Run in Watch Mode
Automatically re-run tests as you edit code.
```bash
npm run test:watch
```

### Run with Coverage
See exactly which lines of the audit engine are tested.
```bash
npm run test:coverage
```

### Run a Specific File
```bash
npx vitest run core/audit-engine/index.test.ts
```

---

## Test Framework & Tools

- **Framework:** Vitest (configured in `vitest.config.ts`)
- **Assertion Library:** Vitest built-in `expect()`
- **Coverage:** Vitest coverage plugin (can be enabled in `vitest.config.ts`)

---

---

## 🛠️ Manual Integration Testing

While the unit tests cover the math, the **Persistence Layer** is verified via the following manual protocols:

### 1. Cloud Persistence Verification
- **Goal**: Ensure audits are successfully saved to Supabase.
- **Test**: Run a new audit on the live URL. If the **"OFFLINE MODE"** banner is NOT visible, the database sync is successful.
- **Verification**: Check the Supabase Table Editor for a new row in the `Audit` table matching the timestamp.

### 2. Public Link Retrieval
- **Goal**: Ensure shareable links load correctly for external visitors.
- **Test**: Copy the generated results URL and open it in a **Private/Incognito** window.
- **Verification**: The dashboard must load the exact data from the session, even though no local storage is present in the incognito window.

### 3. Lead Capture Persistence
- **Goal**: Ensure emails are correctly linked to audit records.
- **Test**: Enter a test email in the "Get the full report" form on the results page.
- **Verification**: Verify that a new entry appears in the `Lead` table and that its `id` matches the `leadId` in the corresponding `Audit` record.

---

## Coverage Summary

The 7 tests cover:
- ✅ **Recommendation Types:** REPLACE (3 tests), CONSOLIDATE (2 tests), KEEP (2 tests), DOWNGRADE (1 test)
- ✅ **Financial Calculations:** Accurate savings calculations for single and multi-seat scenarios
- ✅ **Rule Priority:** Correct rule ordering when multiple rules could apply
- ✅ **Edge Cases:** Minimum/maximum seat counts, team size thresholds, tool overlap detection
- ✅ **Database Persistence:** (Tested manually; not in unit tests — see CI workflow for integration)

---

## CI/CD Integration

Tests are automatically run on every push to `main` via GitHub Actions (`.github/workflows/ci.yml`):
- Trigger: Push to `main` branch
- Steps: Install → Lint → Test → Build
- Status: ✅ Green check required before merge (enforced by branch protection rules)

---

## Test Quality Notes

1. **Deterministic:** All tests produce the same results every run (no randomness, no API calls)
2. **Fast:** Full suite completes in <2 seconds
3. **Isolated:** Each test is independent; can run in any order
4. **Readable:** Test names and input/output are self-documenting
5. **Comprehensive:** Cover happy path, edge cases, and realistic scenarios

---

## Future Test Additions (Week 2+)

- E2E tests: Full audit flow from form submission to email delivery
- Integration tests: Prisma queries and database persistence
- Performance tests: Audit engine latency under 10k requests/day
- API contract tests: Gemini API fallback behavior
