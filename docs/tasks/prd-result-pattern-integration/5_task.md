# Task 5.0: Feature alignment sweep across all API services, stores, and resolvers

<critical>Read the prd.md and techspec.md files from this folder; if you don't read these files your task will be invalidated</critical>

## Overview

Sweep every `*.api.service.ts` under `features/` and `shared/`, every feature store that consumes those services, and the shared resolvers (`CategoriesResolver`, `GendersResolver`) to confirm that (a) declared return types match the unwrapped shape (`Observable<T>`, not `Observable<Result<T>>`), and (b) store callbacks and resolver bodies consume `T` directly with no residual `isSuccess`/`value`/`isFailure` references at the call site. The Tech Spec audit (techspec.md §Technical Considerations decision 7) indicates these files already declare `Observable<T>` and were merely non-functional before Task 2.0 — so the net change for most files is a `grep -r "Result<" src/app/features src/app/shared` confirmation, with targeted edits only where a residual reference is found. Also update any unit test mocks that still emit the old `Result<>` shape so existing specs continue to pass (PRD F6, FR-6.4).

<skills>
### Compliance with Standard Skills

- `.claude/skills/task-review/references/code-standards.md` — camelCase, kebab-case files, single-action functions, no inline comments, English-only identifiers.
- `.claude/skills/task-review/SKILL.md` — post-implementation review verifies TypeScript compilation, Karma/Jasmine pass, and Prettier formatting on every modified file.
- `.claude/skills/execute-final-review/` — after this task, the branch is ready for a full code review.
</skills>

<requirements>
- Every existing API service method under `features/` and `shared/` MUST declare a return type of `Observable<T>` matching the domain shape; no `Result<>` reference may remain in any service public signature (PRD FR-6.1).
- API routes, HTTP verbs, request bodies, headers, and query parameters MUST remain unchanged across every audited file (PRD FR-6.2).
- Feature stores that consume these services MUST consume `T` directly — no `isSuccess`/`value`/`isFailure` checks at the call site (PRD FR-6.3).
- Existing unit tests whose mocks return the old `Result<>` shape MUST be updated to return the unwrapped `T` so suites continue to pass (PRD FR-6.4).
- No unrelated refactors, no architectural changes, no cleanup outside the scope of the contract shift (PRD Out of Scope).
- The user-visible flows for shopping list, shopping details, cart, address, club, and home MUST work end-to-end against the new contract.
- Prettier formatting (tabs, single quotes) MUST be applied to every modified file.
</requirements>

## Subtasks

- [ ] 5.1 Run a project-wide search for residual `Result<` references in `src/app/features/` and `src/app/shared/` (e.g., `Grep` for `Result<` excluding `core/`). Record every hit.
- [ ] 5.2 For each hit in an API service file (`shopping-list.api.service.ts`, `shopping-details.api.service.ts`, `shop-cart.api.service.ts`, `address.api.service.ts`, `select-options.api.service.ts`), change the return type to `Observable<T>` and remove the unused `Result` import.
- [ ] 5.3 For each hit in a feature store (`shopping-list.store.ts`, `shopping-details.store.ts`, `cart.store.ts`, `address.store.ts`), simplify the `next` callback to consume `T` directly and remove any envelope check.
- [ ] 5.4 Verify `CategoriesResolver` and `GendersResolver` still compile and behave correctly; edit only if their declared return type still mentions `Result<>`.
- [ ] 5.5 Run a project-wide search for `Result<` in `*.spec.ts` files under `features/` and `shared/`. Update any mock that still emits the old envelope shape so the existing creation-only stubs continue to compile and pass.
- [ ] 5.6 Run `npm run build` to confirm no TypeScript errors anywhere in the project.
- [ ] 5.7 Run `npm test` to confirm the full Karma/Jasmine suite passes.
- [ ] 5.8 Smoke-test in the browser (`npm start`): shopping list renders bikes, shopping details renders a single bike, cart add/remove works, address selection loads cities/states, and validation failures (try submitting an invalid form) produce the expected single concatenated dialog.

## Implementation Details

See techspec.md §Technical Considerations decision 7 ("F6 is mostly a verification sweep") for the audit summary, §System Architecture → "Modified components" → "Feature stores" for the consumer pattern to look for, §Known Risks for the spec-mock misalignment caveat, and §Relevant and Dependent Files for the full list of files to audit.

## Success Criteria

- `grep -r "Result<" src/app/features src/app/shared` returns zero hits in production code (test files audited separately under subtask 5.5).
- All feature stores consume `T` directly in their `next` callbacks; no `isSuccess`/`value`/`isFailure` references at any call site outside `core/`.
- All Angular routes serving feature screens load and render real data.
- All form submissions that previously worked still work; invalid submissions produce the expected concatenated 422 dialog from Task 3.0.
- `npm run build` succeeds with zero new TypeScript errors.
- `npm test` succeeds with zero new failures.

## Task Tests

- [ ] Unit tests: existing creation-only stubs in `auth.api.service.spec.ts`, `shop-cart.api.service.spec.ts`, `shopping-details.api.service.spec.ts`, and `shopping-list.api.service.spec.ts` continue to pass. Update mock return shapes only where compilation breaks per PRD FR-6.4.
- [ ] E2E tests: not applicable as part of this initiative; manual browser smoke test per subtask 5.8 provides the integration signal.

<critical>ALWAYS CREATE AND EXECUTE TASK TESTS BEFORE CONSIDERING IT COMPLETED</critical>

## Relevant Files

- `src/app/features/shopping/shopping-list/services/shopping-list.api.service.ts` (audit / modify if needed)
- `src/app/features/shopping/shopping-list/store/shopping-list.store.ts` (audit / modify if needed)
- `src/app/features/shopping/shopping-details/services/shopping-details.api.service.ts` (audit / modify if needed)
- `src/app/features/shopping/shopping-details/store/shopping-details.store.ts` (audit / modify if needed)
- `src/app/features/shopping/cart/services/shop-cart.api.service.ts` (audit / modify if needed)
- `src/app/features/shopping/cart/store/cart.store.ts` (audit / modify if needed)
- `src/app/features/address/services/address.api.service.ts` (audit / modify if needed)
- `src/app/features/address/store/address.store.ts` (audit / modify if needed)
- `src/app/shared/services/select-options.api.service.ts` (audit / modify if needed)
- `src/app/shared/resolvers/categories.resolver.ts` (audit, no edits expected)
- `src/app/shared/resolvers/genders.resolver.ts` (audit, no edits expected)
- Any `*.spec.ts` under `features/` or `shared/` that mocks `Observable<Result<T>>` (update per subtask 5.5)
