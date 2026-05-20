# Task 1.0: Augment Result models with ValidationResult subclass

<critical>Read the prd.md and techspec.md files from this folder; if you don't read these files your task will be invalidated</critical>

## Overview

Add a `ValidationResult<T>` class to `src/app/core/api/models/result.ts` that extends the existing `Result<T>` and carries the required `errors: Error[]` array returned by the backend on HTTP 422 responses. This is a purely additive type change that unblocks the error interceptor extension in Task 3.0. The existing `Result<T>` class, `Error` model, and `ErrorTypeEnum` are reused without modification — no parallel types are introduced (PRD FR-7.1, FR-7.2).

<skills>
### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — PascalCase class names, kebab-case file names, English-only identifiers, no abbreviations, no inline comments, max 300 lines per class.
- `.claude/skills/task-review/SKILL.md` — post-implementation review verifies TypeScript compilation, Karma/Jasmine pass, and Prettier formatting (tabs, single quotes).
</skills>

<requirements>
- `ValidationResult<T>` MUST extend `Result<T>` (not replace or duplicate it).
- The `errors` field MUST be typed `Error[]` (importing the existing `Error` model from `core/errors/models/error.ts`) and MUST be a required, non-optional property of the subclass.
- The constructor MUST accept `errors: Error[]` and `error: Error` and call `super(false, error)` so the parent invariants for failure (`isSuccess: false`, `isFailure: true`) are preserved.
- No new file is created; the subclass lives in `src/app/core/api/models/result.ts` alongside `Result<T>`.
- No changes to the existing `Result<T>` class signature, constructor, or behaviour.
- No changes to `Error` model or `ErrorTypeEnum`.
- Prettier formatting (tabs, single quotes) MUST be applied.
</requirements>

## Subtasks

- [ ] 1.1 Add the `ValidationResult<T>` class definition to `src/app/core/api/models/result.ts` per the shape declared in techspec.md §Implementation Design.
- [ ] 1.2 Verify the file still compiles in isolation (`npm run build` or `tsc --noEmit`) and that no consumer currently in the codebase breaks.

## Implementation Details

See techspec.md §Implementation Design → "Main Interfaces" for the exact class shape, and §System Architecture → "New components" for placement rationale. The backend contract this type mirrors is documented in techspec.md §Integration Points → "Validation failure".

## Success Criteria

- `ValidationResult<T>` exported from `src/app/core/api/models/result.ts` and importable by other files.
- Existing `Result<T>` definition unchanged byte-for-byte except for additions below the class.
- TypeScript compilation succeeds with no new errors.
- Prettier reports the file as formatted.

## Task Tests

- [ ] No new spec is required for this pure type change. Compilation succeeds (`npm run build`) and the existing test suite (`npm test`) continues to pass unchanged.

<critical>ALWAYS CREATE AND EXECUTE TASK TESTS BEFORE CONSIDERING IT COMPLETED</critical>

## Relevant Files

- `src/app/core/api/models/result.ts` (modified)
- `src/app/core/errors/models/error.ts` (read for import)
