# UI assets

Images for combat/meditation and inventory. Referenced via `src/constants/ui.ts` (UI_ASSETS) in CombatContainer and MeditationContainer.

- **Character portraits** (chosen at game start: Male/Female). Used via `getCharacterImage(gender, variant)` in `src/constants/ui.ts`.
  - **default** (combat, bag area): `male-default.webp`, `female-default.webp`
  - **lotus** (meditation): `male-lotus.webp`, `female-lotus.webp`
- **bag.webp** – Inventory bag icon (combat container).
- **backpack.webp** – Icon for "Possible finds" / loot table trigger on fishing, mining, and gathering areas. Shown next to the label; hover shows the list of possible drops. If missing, a "?" fallback is shown.
