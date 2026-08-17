---
name: Refactor & Development Logging Rule
description: Mandatory rules for logging component refactoring and development changes on a daily basis.
---

# Refactor & Development Logging Rule

## 1. Purpose

Standardize how we:

- Record development progress and refactoring steps.
- Preserve context for future feature additions or system refactoring.
- Track changes to SFS components day by day.

This rule is **mandatory** for both developers and AI agents.

---

## 2. General Principles

1. **Simultaneous Build & Refactor:** Starting from May 19, 2026, we will build new features while simultaneously refactoring the codebase for the SFS system.
2. **Refactoring Scope Definition:** Only changes, additions, or modifications that are written for and used by the pages in the new directories `/home/hieubui/maps_crm_nextjs_account_manager/app/portal_sfs` and `/home/hieubui/maps_crm_nextjs_account_manager/app/onboarding_sfs` are counted as refactoring and allowed to be logged in the refactor logs.
3. **Commit Policy:** Daily log files are intended to be committed to the repository. Do NOT add `.refactor-log/` to `.gitignore`.
4. **Daily Progress Log:** All changes made to components, APIs, hooks, or configurations must be logged day-by-day in `/home/hieubui/maps_crm_nextjs_account_manager/.refactor-log/`.
5. **Log Format:** Log files must be named using the date format `MM-DD-YYYY.md` (e.g., `05-19-2026.md`).

---

## 3. Log File Structure & Guidelines

Each daily log file should document:

- **Date & Overview:** A short summary of the day's goals and tasks.
- **Commit Link:** (Optional) If the user provides a commit link (e.g., GitHub URL or commit hash), it must be added under a dedicated "Commit Link" section in the log.
- **Components & Files Modified:** A detailed list of files modified or created, and the rationale behind the changes.
- **Refactoring Activities:** Decoupling from old legacy systems (e.g., SMPL), fixing styling, improving component isolation, updating services, etc.
- **Architectural Notes:** Explanations of why certain patterns were chosen to make future code reviews and developer handovers seamless.

Example structure of a daily log file:

```markdown
# Refactoring & Development Log - MM-DD-YYYY

## Overview

- Summary of the primary tasks, features implemented, and refactoring goals for today.

## Commit Link

- [Commit URL or Hash] (if provided by the user)

## Changes Completed

### 1. Component Refactoring / Creation

- `components/refactored/...`: [Description of changes, e.g., added new props, converted to Base UI, etc.]
- `views/...`: [Description of page/view changes, styling updates, etc.]

### 2. Services & APIs

- `services/...`: [Endpoints updated, DTO modifications, query key adjustments]

### 3. I18N / Configuration

- `locales/...`: [New translation keys added, namespace cleanups]

## Technical Debt & Decoupling Notes

- Details on how components were decoupled from SMPL.
- Guidelines/notations for future refactoring or features related to these components.
```

---

## 4. Why We Apply This Rule

- **Knowledge Persistence:** Ensures that the context of changes is preserved across agent sessions and developer handoffs.
- **Architectural Clarity:** Provides a clear history of how SFS components are being developed and decoupled from legacy SMPL code.
- **Easy Handover/Reference:** Makes it straightforward to search or check the logs before planning next steps or adding features.
