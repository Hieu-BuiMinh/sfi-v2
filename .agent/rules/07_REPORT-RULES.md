---
trigger: manual
---

# Report Generation Rules

Always generate daily progress reports using the following structure:

## File Format

- Write logs under `Report DD/MM/YYYY` headers.
- **NEVER** include filenames, file paths, or file schema links inside the descriptions. Focus purely on describing the actions performed.
- Use `  - [sfs]` prefix for all list items.

## Sections

1. **Tasks & Done**: Summarize completed tasks in past tense.
2. **Doing**: Describe current tasks that are in progress.
3. **Priority**: Outline key priorities for next steps.
4. **PR(s)**: Link to the corresponding pull request.

## Example

```markdown
Report 16/06/2026

1. Tasks & Done:
    - [sfs] Reorganized the corporate edit view tabs in the Application Inspector by creating isolated step-specific edit components for all sections.
    - [sfs] Centralized the save and cancel form actions to the parent inspector layout.

2. Doing:
    - [sfs] Verifying corporate onboarding and inspector workflows in UAT.

3. Priority:
    - [sfs] Ensure correct state propagation on edit forms.

4. PR(s): https://git.sg-maps.com/sf/maps/maps_crm_nextjs_account_manager/-/merge_requests/3167
```
