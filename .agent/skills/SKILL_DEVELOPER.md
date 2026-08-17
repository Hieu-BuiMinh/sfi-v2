---
name: Project Frontend - Developer Skills Guide
description: Required and recommended skills to work effectively in the Project frontend (Next.js 14 App Router, TypeScript, Tailwind, MUI, React Query, service layer + DTO).
---

# Developer Skills (Project Frontend)

This document describes the **required skills** to work effectively in the Project codebase.
(This covers skills, not rules. Rules are defined in “Project Rules & Conventions”.)

---

## 1) Core Skills (Mandatory)

### Next.js 14 (App Router)

- Understand Server Components vs Client Components (`"use client"`)
- Understand routing inside `app/`, route groups `(...)`, layout, and page
- Know how to structure “thin pages” in `app/` and render views from `views/`

### TypeScript (Strong Typing)

- Proficient in typing:
    - DTOs (request/response)
    - Generics (especially when calling APIs)
    - Union types, optional fields, type narrowing

- Write clear types, avoid using `any`

### React Query (TanStack Query)

- Understand:
    - `useQuery` lifecycle (loading/error/success)
    - Cache key strategy (array-based keys)
    - Invalidation/refetch, staleTime/cacheTime (if configured in the project)

- Use query keys from the service layer to avoid duplicate keys

### API Service Layer (Api Wrapper + DTO)

- Organize services according to API paths (mimic path structure)
- Be comfortable with the pattern:
    - `key()` for React Query
    - `get()` to perform API calls via the `Api` wrapper

- Always define DTOs for responses (do not “guess the shape” inside components)

---

## 2) UI Skills (Mandatory)

### Tailwind CSS (Layout & Spacing)

- Use Tailwind for:
    - Layout (flex/grid)
    - Spacing (gap, padding/margin)
    - Responsive design (sm/md/lg)

- Know how to keep class names clean (prefer using `cn` utility if available)

### MUI Components (Material UI)

- Be proficient with commonly used components:
    - Button, TextField, Select, Checkbox, Radio
    - Dialog/Modal, Drawer
    - Table, Pagination
    - Snackbar/Alert

- Understand how to combine MUI + Tailwind correctly:
    - Tailwind: layout + spacing
    - MUI: complex components + accessibility + behavior

---

## 3) Project Organization Skills (Recommended)

### Separation of Concerns in the Codebase

- `app/`: routing + compose layout/page
- `views/`: UI pages (client-side)
- `services/`: API logic + DTO
- `components/refactored/`: reusable components
- `types/`: global shared types
- `utils/`: helpers (date/money/string)

### Naming & Consistency Mindset

- Use clear, meaningful, and feature-based naming
- Read and follow conventions before creating new files
- Write maintainable code (readable, testable, reusable)

---

## 4) Debugging & Quality (Recommended)

### Debugging Next.js / React

- Read stack traces and identify server/client boundary issues
- Handle basic hydration mismatch problems
- Check network calls, response shapes, and headers

### Code Review Readiness

- Write review-friendly code:
    - Extract small functions
    - Provide complete typing
    - Avoid complex logic inside UI components

- Proactively update/extend DTOs when APIs change

---

## 5) Bonus Skills (Nice to Have)

- Form handling (react-hook-form / validation patterns if used in the project)
- i18n (if multilingual support exists)
- Performance basics (proper memoization, avoid heavy re-renders)
- Testing (unit/integration) if the codebase includes setup

---

## Quick Checklist (Before Starting a Task)

- [ ] Ensure all internal imports use `@/` alias (e.g., `@/components/...` instead of `../../components/...`)
- [ ] Understand the route is in `app/` and the view is in `views/`
- [ ] Know where the related service is located (`services/admin|user/...`)
- [ ] Use query keys from service `key()`
- [ ] Know where DTOs are defined and how to extend types properly
- [ ] Use Tailwind for layout + MUI for complex components
