# jjmilk

A new project. Domain concepts to be defined lazily via `/grill-with-docs` as features are built.

## Language

_No domain terms resolved yet. Terms will be added here by `/grill-with-docs` as design decisions crystallise._

<!--
Each term follows this pattern:

**Term Name**:
A concise definition of what it IS, not what it does.
_Avoid_: synonym1, synonym2
-->

## Relationships

_No relationships defined yet._

## Example dialogue

_No example dialogue yet — will be written once the first domain terms are resolved._

## Flagged ambiguities

_None yet._

## Workflow conventions

- **Development process**: Strict TDD via `/tdd` — red-green-refactor cycle. Every feature starts with a failing test, then minimal code to pass, then refactor.
- **PRD location**: All PRDs live under `docs/` (e.g. `docs/PRD-<feature>.md`), not under `.scratch/`.
- **Issue tracker**: Local markdown issues under `.scratch/<feature-slug>/issues/`.
- **Domain docs**: Single-context — one `CONTEXT.md` + `docs/adr/` at the root.
