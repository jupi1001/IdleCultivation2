# Persistence migrations

Per-slice migration maps and a single entry point (`runMigrations`) used by redux-persist.

## Ownership

| Slice | Owner | Migrations |
|-------|--------|------------|
| `character` | `state/reducers/characterCoreSlice` | Defaults, `items` → `itemsById` |
| `settings` | `state/reducers/settingsSlice` | Defaults |
| `reincarnation` | `state/reducers/reincarnationSlice` | Defaults |
| `content` | `state/reducers/contentSlice` | Legacy `page` string → `route` object |
| *global* | store | Extract settings/reincarnation/combat/stats/sect/inventory/equipment/**skills** from character (one-time) |

When adding a new persisted slice (e.g. Task 1 split), add a migration file, register it in `index.ts` under `SLICE_MIGRATIONS`, and document it in this table and in the comment at the top of `index.ts`.

## Adding a migration

1. Add a new migrator to the slice’s migration array (e.g. `characterMigrations.ts`). Migrators must be **idempotent** (safe to run on already-migrated state).
2. For cross-slice moves, add a step to `globalMigrations.ts` and document it.

## Version

`persistConfig.version` in `store.ts` is the **global** persist version. Per-slice versioning is implicit: we run all migrators for each slice in order every rehydrate. Bump the global version when you need to force a full re-run or document a breaking change.
