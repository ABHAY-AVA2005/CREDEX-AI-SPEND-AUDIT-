# Missing Project Requirements

Based on the Credex AI Spend Audit project brief, the current version is missing the following deliverables. These must be completed to avoid automatic rejection.

## 1. Missing Required Files
- [ ] **`DEVLOG.md`**: Create this file with 7 dated entries. Each entry must include:
  - Hours worked
  - What I did
  - What I learned
  - Blockers / what I'm stuck on
  - Plan for tomorrow
- [ ] **`REFLECTION.md`**: Answer the 5 specific questions (150–400 words each):
  1. The hardest bug you hit this week, and how you debugged it.
  2. A decision you reversed mid-week, and why.
  3. What you would build in week 2 if you had it.
  4. How you used AI tools (which tools, tasks, lack of trust, and a specific time the AI was wrong).
  5. Self-rating (1-10) on discipline, code quality, design sense, problem-solving, entrepreneurial thinking + 1-sentence reason for each.
- [ ] **`TESTS.md`**: List every automated test written (filename, what it covers, how to run it). Must have a minimum of 5 tests covering the audit engine specifically.
- [ ] **`.github/workflows/ci.yml`**: Create a GitHub Actions workflow that runs lint + tests on every push to `main`.

## 2. Missing Automated Tests
- [ ] Set up a testing framework (e.g., Vitest or Jest).
- [ ] Write a minimum of **5 working automated tests** that verify the logic in `core/audit-engine`. The reviewers will actually run these.

## 3. Missing Sections in Existing Files
- [ ] **`README.md`**: Add **3+ screenshots** OR a 30-second screen recording link (YouTube/Loom).
- [ ] **`ARCHITECTURE.md`**: 
  - [ ] Add a system diagram (in Mermaid or ASCII).
  - [ ] Add a "Data flow" section detailing how a user's input becomes an audit result.
  - [ ] Add a section on what you would change if the app had to handle 10k audits/day.
