# Testing conventions

This document defines how tests are structured and run in the project so that domain, state, and UI tests stay consistent and discoverable.

## Test runner and config

- **Runner**: [Vitest](https://vitest.dev/) (see `vite.config.ts`).
- **Run once**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Include pattern**: `src/**/*.test.ts` and `src/**/*.test.tsx` (colocated next to source).

## Folder and file strategy

- **Colocated tests**: Place test files next to the code they cover, e.g.:
  - `src/utils/combatMath.ts` → `src/utils/combatMath.test.ts`
  - `src/state/selectors/characterSelectors.ts` → `src/state/selectors/characterSelectors.test.ts`
  - `src/state/reducers/settingsSlice.ts` → `src/state/reducers/settingsSlice.test.ts`
  - `src/types/itemGuards.ts` → `src/types/itemGuards.test.ts`
  - `src/components/Tooltip/Tooltip.tsx` → `src/components/Tooltip/Tooltip.test.tsx`
  - `src/hooks/useCastProgress.ts` → `src/hooks/useCastProgress.test.ts`
- **Naming**: Use `*.test.ts` for non-React tests and `*.test.tsx` when the test file contains JSX or imports React components.
- **No `__tests__` folders**: We do not use a separate `__tests__` directory; tests live beside the module under test.

## Shared test utilities

- **Location**: `src/test-utils/`
- **Purpose**: Shared helpers so tests don’t duplicate setup (e.g. Redux state, render with providers).
- **Exports**:
  - `createMockState(character?, combat?)`: Builds a minimal `RootState` for selector/reducer/component tests. Import from `@/test-utils` or `../../test-utils` as appropriate.
  - `renderWithProviders(ui, { preloadedState?, store? })`: Renders a React tree with Redux `Provider` and optional preloaded state (for component/hook tests that need the store).

Use these instead of redefining mock state or provider setup in each test file.

## Test categories and examples

Each category has at least one example in the repo; follow the same patterns when adding tests.

| Category        | What to test                         | Example(s)                                      |
|----------------|--------------------------------------|-------------------------------------------------|
| **Domain**     | Type guards, pure helpers, item/entity shape | `src/types/itemGuards.test.ts`                 |
| **Selector**   | Redux selectors (derived state)       | `src/state/selectors/characterSelectors.test.ts`|
| **Reducer**    | Slice initial state and reducers     | `src/state/reducers/settingsSlice.test.ts`      |
| **Component**  | React components (state-driven UI, interactions) | `src/components/Tooltip/Tooltip.test.tsx`  |
| **Hook**       | Custom hooks (return values, timers, cleanup)   | `src/hooks/useCastProgress.test.tsx`        |

### Domain tests

- Test type guards and pure domain functions with plain inputs.
- Use small inline fixtures or shared fixtures (e.g. valid items) as needed.
- No Redux or DOM; environment can stay `node` for `*.test.ts`.

### Selector tests

- Use `createMockState()` from `test-utils` to build `RootState`.
- Assert on selector return values and edge cases (empty state, multiple bonuses, etc.).
- No DOM; use `*.test.ts` with `node` environment.

### Reducer tests

- Import the slice reducer and actions; call the reducer with initial state and actions.
- Assert on resulting state; cover initial state, payloads, and guards.
- No DOM or timers; use `*.test.ts` with `node` environment.

### Component tests

- Use `renderWithProviders()` from `test-utils` when the component needs the Redux store.
- Use `@testing-library/react` for `render`, `screen`, `userEvent`; query by role/label/text.
- Prefer `*.test.tsx` and set `// @vitest-environment jsdom` at the top of the file (or rely on config for `*.test.tsx`).

### Hook tests

- For hooks that need a React tree (e.g. using Redux or DOM), use `renderWithProviders` and a tiny wrapper component that invokes the hook and exposes results.
- For hooks that use timers, use Vitest’s fake timers (`vi.useFakeTimers()` / `vi.useRealTimers()`) and advance time as needed.
- Use `*.test.ts` or `*.test.tsx` and the same environment as component tests when the hook uses DOM or store.

## Environment

- **Node** (`environment: 'node'`): Default for `*.test.ts`; used for domain, selectors, reducers, and pure utils.
- **jsdom**: Used for component and hook tests that need DOM (e.g. `Tooltip`, `useCastProgress`). Set per file with `// @vitest-environment jsdom` in the first line, or configure in `vite.config.ts` for `*.test.tsx`.

## When to add tests

- **New domain logic** (guards, helpers): Add a `*.test.ts` next to the module.
- **New or changed selectors**: Add/update tests in the colocated `characterSelectors.test.ts` (or the relevant selector file).
- **New or changed reducers**: Add/update tests next to the slice (e.g. `settingsSlice.test.ts`).
- **New screens or critical UI**: Add component tests with `renderWithProviders` and RTL.
- **New hooks with non-trivial logic or timers**: Add hook tests with fake timers and cleanup assertions.

## Coverage

- Run coverage with Vitest’s coverage (e.g. `vitest run --coverage`); config is in `vite.config.ts`.
- Exclude `**/*.test.ts(x)`, `node_modules`, and type-only modules from coverage so the report reflects production code.

## Zod schemas and runtime validation

- **Schemas location**: Runtime validation schemas live under `src/schemas/`:
  - `items.ts`: discriminated `Item` union (consumable, equipment, technique, material, quest, setPiece).
  - `enemies.ts`: enemy definitions and loot (including items/weight length check).
  - `areas.ts`: fishing/mining/gathering areas (base/timed activity fields + loot ids).
  - `talents.ts`: talent effects, nodes, and tree tiers.
  - `saveState.ts`: shallow schema for the persisted root state after migrations.
- **Usage at boundaries**:
  - **Content**: domain modules call their parse helpers in dev/test only (e.g. enemies, areas, talents) to catch bad content early without touching hot render loops.
  - **Save/migrations**: `runMigrations` validates the migrated redux-persist payload with `parsePersistedRootState` in non-production builds.
- **When to add/update schemas**:
  - When adding a new **domain registry** (items, enemies, areas, talents, loot tables), add or extend a schema in `src/schemas/` and, for dev, call its parse helper where the registry is built.
  - When changing the persisted **root state shape** (adding/removing a slice or top-level key), update `saveState.ts` so migrations remain schema-checked.
  - Do **not** put Zod validation in tight per-frame or per-tick paths; prefer one-time validation at module load or startup.
