# Training assets (martial training)

Images for training area cards and combat enemies. Paths from `src/constants/training.ts` and `src/constants/data.ts`. All assets use **.webp**.

---

## Area images (this folder)

One image per combat area. Filenames must match exactly (code uses these in `TRAINING_AREA_IMAGE_SLUG`).

| File | Area (display name) |
|------|---------------------|
| `village.webp` | Village Outskirts |
| `spirit-beast-cave.webp` | Spirit Beast Cave |
| `crystal-mine.webp` | Crystal Mine |
| `blackwater-river-gorge.webp` | Blackwater River Gorge |
| `ancient-sect-ruins.webp` | Ancient Sect Ruins |
| `thousand-miasma-marsh.webp` | Thousand Miasma Marsh |
| `void-rift-expanse.webp` | Void Rift Expanse |
| `heavenpiercer-peak.webp` | Heavenpiercer Peak |
| `endless-cloudsea-sanctuary.webp` | Endless Cloudsea Sanctuary |
| `nine-heavens-thunder-plateau.webp` | Nine Heavens Thunder Plateau |
| `jade-immortal-court.webp` | Jade Immortal Court |

**Currently present:** All 11 area images are in use.

---

## Enemy images (subfolder `enemies/`)

Filename = enemy name in **kebab-case** (lowercase, spaces → hyphens, strip non-alphanumeric). Example: "Starving Wolf" → `starving-wolf.webp`.

**Currently present:**
- `starving-wolf.webp`

**Expected (add as you create them):** One `.webp` per enemy from `src/constants/data.ts`. Examples: `bandit-lookout.webp`, `wild-boar.webp`, `stonehide-bat.webp`, `ember-eyed-weasel.webp`, … (55 enemies total; see data.ts `enemies` array). If a file is missing, the UI shows a broken image for that enemy but combat still works.
