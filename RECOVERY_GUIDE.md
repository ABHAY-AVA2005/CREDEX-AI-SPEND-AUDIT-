# 🛡️ Git Checkpoints & Recovery Guide

This document is a consolidated, high-fidelity reference sheet for the safety checkpoints created on **May 17, 2026** before executing the **Fluxora v2** upgrades. 

> [!NOTE]
> This guide merges the previous `CHECKPOINTS.md` and `RECOVERY_GUIDE.md` into a single, comprehensive safety blueprint. The redundant `CHECKPOINTS.md` has been removed to keep the repository root clean.

---

## 📊 Summary: Which Recovery Method is Best?

When reverting or switching states, choosing the right method balance between **safety** and **ease of use** is critical. Here is a breakdown of the three primary git recovery mechanisms available in this repository:

| Recovery Type | Safety Level | Ease of Use | Best Used For... | Pros & Cons |
| :--- | :--- | :--- | :--- | :--- |
| **🏷️ Git Tags** <br>`pre-upgrade-v2` | ⭐⭐⭐⭐⭐ <br>**(Highest)** | ⭐⭐⭐⭐ <br>**(High)** | Permanent baselines, stable releases, and hard rollbacks. | **Pros:** Immutable and permanent; cannot be moved by accident.<br>**Cons:** Places you in a *detached HEAD* state if checked out directly. |
| **🌿 Git Branches** <br>`backup-before-upgrade-v2` | ⭐⭐⭐ <br>**(Medium)** | ⭐⭐⭐⭐⭐ <br>**(Easiest)** | Quick inspection, exploring baseline code, and making parallel edits. | **Pros:** Extremely easy to switch to; normal branch workflow.<br>**Cons:** Dynamic; the pointer moves if you accidentally commit to it. |
| **🕒 Git Reflog** <br>`git reflog` | ⭐⭐⭐⭐⭐ <br>**(Bulletproof)** | ⭐⭐⭐ <br>**(Requires Command)** | Recovering from accidental deletions or destructive `git reset --hard` actions. | **Pros:** Tracks every single action; saves you from otherwise "lost" work.<br>**Cons:** Local only; commits are eventually garbage-collected (30-90 days). |

### 🏆 The Recommendation
1. **For Safe Browsing:** Use the **Branch** (`backup-before-upgrade-v2`). It is the easiest and safest way to look around without getting into a detached HEAD state.
2. **For Hard Restoration:** Use the **Tag** (`pre-upgrade-v2`). It is the safest baseline because it guarantees the codebase is exactly in the original state, regardless of subsequent changes.
3. **If You Make a Mistake:** Keep calm and use **Reflog** (`git reflog`) to undo any accidental destructive resets.

---

## 📍 Active Checkpoints in This Repository

Below are the exact checkpoints available in your repository. Use these identifiers in your recovery commands:

| Checkpoint Name / Type | Commit SHA | Description | Created Date / Status |
| :--- | :--- | :--- | :--- |
| **Tag:** `v2-cfo-robust-stable` <br> *Current Production HEAD* | `cbf87923e240a564b483419e27b03552e7a93e97` | Robust CFO 3-sentence summary, client-side fallback component, Vitest suite, and categorized tech stack docs | 2026-05-18 16:15 (IST) - **ACTIVE** |
| **Tag:** `v2-elite-stable` | `77214305539bbc3fc401cead4d555519e3ad98e4` | Modern polished v2 Release with animations, scroll fixes, and marketplace removals | 2026-05-17 20:30 (IST) |
| **Tag:** `pre-upgrade-v2` <br> *also: `checkpoint-v2`, `checkpoint-2026-05-17`* | `2cd8bea1487d264247ab5039e4007de56f857411` | Standard stable checkpoint following original v1 | 2026-05-17 16:05 (IST) |
| **Branch:** `backup-before-upgrade-v2` | `2cd8bea1487d264247ab5039e4007de56f857411` | Lightweight backup branch bookmarking stable state | 2026-05-17 16:05 (IST) |
| **Tag:** `original-stable-v1` | `5ff024a8283fc3ee23ffb74c59d1753f256cac29` | Original production baseline tag | 2026-05-14 (IST) |

---

## 🛠️ Step-by-Step Recovery Procedures

Choose the scenario below that matches your goal:

### Scenario A: I just want to browse/inspect the stable baseline code (Safe & Easy)
Use the backup branch to inspect the code. Since it is a normal branch, it is easy to navigate and doesn't trigger a detached HEAD state.
```powershell
# 1. Switch to the backup branch
git checkout backup-before-upgrade-v2

# 2. Browse files or run tests normally...

# 3. Switch back to your main branch when finished
git checkout main
```

### Scenario B: I want to start making changes starting *from* the stable checkpoint (Safest Workflow)
If you want to try a different implementation starting from the baseline, create a new branch branching off the immutable tag:
```powershell
# Create and switch to a new branch starting exactly at the pre-upgrade checkpoint
git checkout -b feature-reboot-v2 pre-upgrade-v2
```

### Scenario C: Everything is broken, and I want to completely reset my current branch to the baseline (⚠️ Destructive Rollback)
If your current active branch is in a bad state and you want to completely discard all changes (committed and uncommitted) since the upgrade, hard reset your current branch to the immutable tag:
> [!WARNING]
> This command will permanently delete any uncommitted files in your working directory. Ensure you backup any untracked files you wish to keep before running this.
```powershell
# 1. (Optional but Recommended) Stash current uncommitted changes just in case
git stash -u

# 2. Hard reset your current branch to the stable checkpoint tag
git reset --hard pre-upgrade-v2
```

### Scenario D: The Safety Net — "I accidentally did a hard reset and lost my work!" (Absolute Safety)
If you run `git reset --hard` or delete a branch and realize you lost important changes, Git keeps a history of all HEAD movements in the local reflog. You can restore your work with these steps:
```powershell
# 1. View the local history of all HEAD movements
git reflog

# 2. Look for the entry right BEFORE your reset (e.g., HEAD@{1}) and note its SHA (e.g., 2cd8bea)
# 3. Create a recovery branch pointing to that exact commit:
git checkout -b recovered-work <COMMIT_SHA_FROM_REFLOG>
```

---

*Keep this file as a permanent reference in the repository root for safe and structured development.*
