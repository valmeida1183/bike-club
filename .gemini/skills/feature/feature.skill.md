---
name: feature
description: Use this skill to follow the folders structure when create a new feature inside `src/app/features/` folder
---

# Feature

This skill guides the agent in features folder naming and pattern conventions.

## Structure

The new feature folder structure follow the example below. Each feature can have any folder below depend of requirements.

- my-feature
  | - components/ # Dumb components for presententional purposes.
  | - containers/ # Smart components
  | - models/ # Models related to "my-feature"
  | - services/ # Angular services in general.
  | - store/ # Angular NGRX Signal Store files that should have at least this two files:
  | | - my-feature.state.ts # An interface that defines the state properties that Store have.
  | | - mu-feature.store.ts # An NGRX Signal store implementation.
  | - validators/ # If this feature needs custom Angular forms validators
  | - guards/ # If this feature needs custom route-guards
  | - enums/ # If this feature needs some typescript enums
  | - functions/ # If this feature requers a separate function.
