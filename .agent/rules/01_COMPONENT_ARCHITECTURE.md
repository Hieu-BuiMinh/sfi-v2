---
trigger: always_on
description: Detailed component architecture and naming rules (kebab-case file naming) for the Project frontend.
---

# Component Architecture & Rules

This document defines mandatory rules for organizing and implementing components in the Project frontend.

Primary goals:

- Separation of concerns
- Scalable folder structure
- Consistent naming
- Clean UI components (no business/data logic)
- Easy reuse across features

---

# 1) Component Placement Rules

## 1.1 Shared / Reusable Components (GLOBAL)

Use `base-component/components/` for components that are:

- Reused across multiple features (onboarding + portal)
- Generic UI building blocks
- Inputs, buttons, dialogs, table wrappers, layout primitives

**Location**

```

src/base-component/components/

```

✅ Examples:

- `src/base-component/components/nav-bar.tsx`
- `src/base-component/components/side-bar.tsx`

---

## 1.2 Feature Components (LOCAL to a Feature)

Use `views/{feature}/components/` for components that are:

- Used only inside a single feature (onboarding OR portal)
- Tightly coupled to a feature layout/workflow/content
- Not intended to be reused globally

**Location**

```

views/

```

✅ Example (your case):

```

views/onboarding/components/hero-carousel/

```

You can put multiple files inside a feature component folder if it’s a complex component.

---

# 2) File Naming Convention (MANDATORY)

## 2.1 File names must be kebab-case

✅ Correct:

```

hero-carousel.tsx
hero-carousel-item.tsx
app-button.tsx
sfs-text-field.tsx
rhf-sfs-text-field.tsx

```

❌ Incorrect:

```

HeroCarousel.tsx
heroCarousel.tsx
hero_carousel.tsx

```

Rules:

- lowercase only
- words separated by `-`
- no underscores
- no PascalCase

---

## 2.2 Component name inside file must be PascalCase

Even if the file is kebab-case, component name remains PascalCase:

```tsx
export default function HeroCarousel() {
	return <div />
}
```

File:

```
hero-carousel.tsx
```

---

# 3) Folder Naming Convention

All folders must be kebab-case.

✅ Correct:

```
hero-carousel/
account-summary-card/
```

❌ Incorrect:

```
HeroCarousel/
accountSummaryCard/
```

---

# 4) Structure for Feature Component Folders

If a feature component is simple, you may keep a single file:

```
views/onboarding/components/hero-carousel.tsx
```

If it is complex, use a folder:

```
views/onboarding/components/hero-carousel/
  ├── hero-carousel.tsx
  ├── hero-carousel-item.tsx
  ├── hero-carousel.types.ts
  └── index.ts
```

### Rules inside feature folders

- `hero-carousel.tsx` is the main component
- subcomponents must also be kebab-case
- `index.ts` is optional; use only if it improves imports

---

# 5) One Main Component per File

Each `.tsx` file should export **one main component**.

Allowed:

- Small internal helper components (not exported) if they are truly private.

Not allowed:

- Multiple exported components from the same file unless they are tightly coupled and exported intentionally via `index.ts`.

---

# 6) Component Layering

## 6.1 Base UI Components (Shared)

Location:

```
components/refactored/input/sfs/
components/refactored/common/
```

Rules:

- UI-only
- controlled props (value/onChange)
- no React Hook Form
- no React Query
- no API calls
- no business logic

---

## 6.2 RHF Wrappers (Shared)

Location:

```
components/refactored/form-input/sfs/
```

Rules:

- must wrap Base UI component
- must use `Controller`
- no UI duplication
- handle only RHF binding + error mapping

Naming:

```
rhf-sfs-*.tsx
```

---

## 6.3 Feature UI Components (Local)

Location:

```
views/onboarding/components/
views/portal/components/
```

Rules:

- can contain feature-specific layout/content
- may call feature-specific hooks
- must NOT call API directly (API belongs to services + React Query hooks)
- should remain mostly presentational

---

# 7) What is NOT Allowed

❌ Calling API directly inside components
❌ Hardcoding React Query keys in components
❌ Using `fetch/axios` directly in UI
❌ Using `any`
❌ Binding React Hook Form inside Base Inputs
❌ Putting shared components inside `views/`
❌ Putting feature-only components inside `components/refactored/`
❌ Using relative imports when `@/` alias is available

---

# 8) Example Project Structure

```
components/
└── refactored/
    ├── common/
    │   ├── app-button.tsx
    │   └── page-header.tsx
    ├── input/
    │   └── sfs/
    │       ├── sfs-text-field.tsx
    │       ├── sfs-select.tsx
    │       └── portal/
    │           ├── sfs-portal-textfield.tsx
    │           ├── sfs-portal-debounce-textfield.tsx
    │           └── sfs-portal-search-field.tsx
    └── form-input/
        └── sfs/
            ├── rhf-sfs-text-field.tsx
            └── rhf-sfs-select.tsx

views/
└── sfs/
    ├── onboarding/
    │   ├── pages/
    │   └── components/
    │       └── hero-carousel/
    │           ├── hero-carousel.tsx
    │           └── hero-carousel-item.tsx
    └── portal/
        ├── pages/
        └── components/
            └── account-summary-card/
                └── account-summary-card.tsx
```

---

# 9) Rule of Thumb

- If it will be reused across multiple features → `components/refactored/`
- If it is only for onboarding or only for portal → `views/{feature}/components/`

---

# 10) Review Enforcement

PR will be rejected if:

- file/folder naming is not kebab-case
- shared components are placed in `views/`
- feature-only components are placed in `components/refactored/`
- UI components call API directly or hardcode query keys

---

# 11) Component Placement Decision Checklist

Before creating a new component, answer the following questions:

---

## Step 1 — Will this component be reused across multiple features?

- Used in both onboarding and portal?
- Used in more than one page?
- Generic UI pattern (button, card, modal, input, layout block)?

If YES → place in:

```

components/refactored/

```

If NO → continue to Step 2.

---

## Step 2 — Is this component tightly coupled to a specific feature?

- Contains feature-specific layout?
- Contains feature-specific copy/content?
- Only used inside onboarding OR portal?
- Not meaningful outside this feature?

If YES → place in:

```

views/{feature}/components/

```

Example:

```

views/onboarding/components/hero-carousel/

```

If NO → continue to Step 3.

---

## Step 3 — Is it a form input abstraction?

If:

- It is a reusable UI input → `components/refactored/input/`
- It binds React Hook Form → `components/refactored/form-input/`

Never place reusable form inputs inside `views/`.

---

## Step 4 — Does this component call API directly?

If YES → ❌ STOP.

Components must not call API directly.

- API logic belongs in `services/`
- Data fetching belongs in React Query hook usage
- UI components receive data via props

---

# Quick Decision Table

| Question                | Location                            |
| ----------------------- | ----------------------------------- |
| Reusable across system? | `components/refactored/`            |
| Only for onboarding?    | `views/onboarding/components/`      |
| Only for portal?        | `views/portal/components/`          |
| Reusable form input UI? | `components/refactored/input/`      |
| RHF binding wrapper?    | `components/refactored/form-input/` |

---

# Golden Rule

If you are unsure:

Default to feature folder first.

Only move to `components/refactored/` when:

- It is reused at least twice
- It is truly generic
- It has no feature-specific logic

Premature generalization creates messy shared folders.

---

# 12) Tailwind CSS Class Concatenation

To ensure consistent and clean class name management, always use the `cn` utility from `@/utils/cn` when concatenating Tailwind CSS classes or applying conditional styles.

✅ Correct:

```tsx
import { cn } from '@/utils/cn'

export default function MyComponent({ className }: { className?: string }) {
	return <div className={cn('flex items-center gap-2 p-4', className)}>...</div>
}
```

❌ Incorrect:

```tsx
export default function MyComponent({ className }: { className?: string }) {
	return <div className={cn(`flex items-center gap-2 p-4 ${className}`)}>...</div>
}
```

Or even worse:

```tsx
<div className={`flex items-center gap-2 p-4 ${className}`}>
```

---

# 14) Common Search Pattern

For table searching or any debounced search input, always use `SfsPortalSearchField`. It pre-configures a search icon and debounce logic.

✅ Correct:

```tsx
import SfsPortalSearchField from '@/components/refactored/input/sfs/portal/sfs-portal-search-field'

export default function MyPage() {
	const handleSearch = (value: string) => {
		// ...
	}

	return <SfsPortalSearchField onDebounce={handleSearch} />
}
```

❌ Incorrect:

Manually adding `SearchRoundedIcon` and `InputAdornment` to a `SfsPortalDebounceTextField` in the page/view layer.

---

# 15) Table Query Parameters Isolation

Every API-backed DataGrid must use an API-specific query-params hook. A generic shared hook such as `useTableParams` is forbidden.

Mandatory rules:

- Name the hook after the API resource or grid, for example `useAdminApplicationsTableParams`.
- Store the hook in the owning page's `hooks/` directory, alongside that page's `components/` directory. Do not collect feature table hooks in a global directory such as `hooks/table/`.
- Example: a grid owned by `views/portal_sfi/admin/pages/applications.page/components/` must keep its params hook at `views/portal_sfi/admin/pages/applications.page/hooks/use-admin-applications-table-params.ts`.
- Declare only the query states that the API request DTO and that grid actually use.
- Keep parsers, defaults, reset behavior, and URL key mapping inside the API-specific hook.
- Use unique `urlKeys` when multiple grids can exist on the same route. Prefix every key with the grid/resource name so pagination and filters cannot overwrite another grid's state.
- Type filter/table component props from the dedicated hook with `ReturnType<typeof useXxxTableParams>`; do not introduce a shared business params type.
- The shared `SfiTable` component may know only generic DataGrid controls such as `page` and `per_page`. It must not import a feature/API params hook or own business filters.
- When an endpoint has no search, filter, date range, or server-sort request field, do not add that state defensively.
- A reset helper must belong to the same hook file and reset only that hook's states.

Example:

```ts
const parsers = {
	page: parseAsInteger.withDefault(1),
	per_page: parseAsInteger.withDefault(10),
	status: parseAsString,
}

export function useAdminApplicationsTableParams() {
	return useQueryStates(parsers, {
		history: 'replace',
		shallow: true,
		scroll: false,
		urlKeys: {
			page: 'applications_page',
			per_page: 'applications_per_page',
			status: 'applications_status',
		},
	})
}
```

---

# 16) Phone Number Validation Rule for Prefix Inputs

When validating phone numbers that use country prefix inputs (such as `RhfSfsPhonePrefixInput` or similar prefix inputs that pre-populate values like `+84` or `+65` by default), a simple `.min(1)` check is **NOT** sufficient. The default country code prefix value will pass the check even if the user hasn't typed their actual phone number.

Always implement custom validation to clean spaces and check for a valid E.164 digit count (between 7 and 15 digits total including the calling code) using Zod `refine`:

```typescript
phone_number: z.string()
	.min(1, 'Phone number is required')
	.refine(
		(val) => {
			const cleaned = val.replace(/\s+/g, '')
			// E.164 format: must start with '+' and have between 7 and 15 digits total
			return /^\+\d{7,15}$/.test(cleaned)
		},
		{ message: 'Invalid phone number format' }
	)
```
