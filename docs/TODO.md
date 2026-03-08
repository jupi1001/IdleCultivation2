# TODO

## Next Version
- **Polish** – Sound and VFX (hits, blocks, kill), tooltips (e.g. how block/damage work).

---

## Combat drops – images needed

Rare combat-only drops (weapons, armor, rings, amulets). Place under `public/assets/combat-drops/`:

- `village-defender-ring.webp` (FARM)
- `spirit-beast-claw.webp` (CAVE)
- `crystal-shard-blade.webp` (CRYSTALCAVE)
- `blackwater-scale-guard.webp` (RIVER)
- `sect-remnant-ring.webp` (RUINS)
- `miasma-ward-amulet.webp` (SWAMP)
- `void-edge-fragment.webp` (RIFT)
- `hermits-crown.webp` (PEAK)
- `cloudsea-lotus-pendant.webp` (SEA)
- `thunderbrand.webp` (STORM)
- `jade-court-sigil.webp` (PALACE)

---

## Sect Phase 3 – Relationships (images needed)

Sect quest rewards and romanceable NPCs. Paths are under `public/`.

### Sect treasures (quest rewards)

Place under `public/assets/sect-treasures/`:

- `jade-mountain-heartstone.webp` (Jade Mountain Sect – ring)
- `verdant-valley-heirloom.webp` (Verdant Valley Sect – amulet)
- `azure-sky-sigil.webp` (Azure Sky Pavilion – amulet)
- `crimson-demon-brand.webp` (Crimson Demon Sect – ring)
- `shadow-serpent-fang.webp` (Shadow Serpent Hall – ring)
- `bone-abyss-relic.webp` (Bone Abyss Sect – amulet)

### Romanceable NPCs (2 images per character: portrait + lotus)

Place under `public/assets/sect-npcs/{sectId}/` where `sectId` is 1–6 (Jade Mountain=1, Verdant Valley=2, Azure Sky=3, Crimson Demon=4, Shadow Serpent=5, Bone Abyss=6).

**Sect 1 – Jade Mountain:** `101-portrait.webp`, `101-lotus.webp`, `102-portrait.webp`, `102-lotus.webp`, `103-portrait.webp`, `103-lotus.webp`, `104-portrait.webp`, `104-lotus.webp`  
**Sect 2 – Verdant Valley:** `105-portrait.webp`, `105-lotus.webp`, … through `108-lotus.webp`  
**Sect 3 – Azure Sky:** `109-portrait.webp` through `112-lotus.webp`  
**Sect 4 – Crimson Demon:** `113-portrait.webp` through `116-lotus.webp`  
**Sect 5 – Shadow Serpent:** `117-portrait.webp` through `120-lotus.webp`  
**Sect 6 – Bone Abyss:** `121-portrait.webp` through `124-lotus.webp`

(24 NPCs × 2 = 48 images total. Portrait = dialogue/casual; lotus = shown in meditation when chosen as cultivation partner.)

---

## Level 100–120 content – images needed

All paths below are under `public/` (e.g. `public/assets/fish/sage-carp.webp`). Add images for these so the new 105/110/115/120 areas and items display correctly.

### Fishing (areas + fish)
- **Areas:** `public/assets/fishing/sage-waters.webp`, `karmic-stream.webp`, `immortal-basin.webp`, `dao-origin-sea.webp`
- **Fish:** `public/assets/fish/sage-carp.webp`, `karmic-koi.webp`, `immortal-bass.webp`, `dao-essence-salmon.webp`

### Cooking (new fish → cooked)
- `public/assets/cooking/grilled-sage-carp.webp`, `karmic-koi-stew.webp`, `immortal-bass-fillet.webp`, `dao-essence-salmon.webp` (or equivalent fillet/stew names per recipe)

### Mining (areas + ores)
- **Areas:** `public/assets/mining/ascendant-vein.webp`, `karmic-crystal-deposit.webp`, `immortal-stone-quarry.webp`, `dao-fragment-mine.webp`
- **Ores:** `public/assets/mining/items/ascendant-ore.webp`, `karmic-crystal-ore.webp`, `immortal-stone.webp`, `dao-fragment.webp`

### Forging (bars + enhanced Celestial gear)
- **Bars:** `public/assets/forging/bar/ascendant-bar.webp`, `karmic-bar.webp`, `immortal-bar.webp`, `dao-bar.webp`
- **Enhanced swords:** `public/assets/forging/sword/ascendant-enhanced-sword.webp`, `karmic-enhanced-sword.webp`, `immortal-enhanced-sword.webp`, `dao-enhanced-sword.webp`
- **Enhanced helmets:** `public/assets/forging/helmet/ascendant-enhanced-helmet.webp`, `karmic-enhanced-helmet.webp`, `immortal-enhanced-helmet.webp`, `dao-enhanced-helmet.webp`
- **Enhanced body:** `public/assets/forging/body/ascendant-enhanced-body.webp`, `karmic-enhanced-body.webp`, `immortal-enhanced-body.webp`, `dao-enhanced-body.webp`

### Gathering (areas + wood + herbs)
- **Areas:** `public/assets/gathering/ascendant-herb-sanctum.webp`, `karmic-lotus-pool.webp`, `immortal-root-grove.webp`, `dao-essence-meadow.webp`
- **Wood:** `public/assets/gathering/items/item-ascendant-wood.webp`, `item-karmic-willow.webp`
- **Herbs:** `public/assets/gathering/items/item-ascendant-herb.webp`, `item-karmic-lotus-petal.webp`, `item-immortal-root.webp`, `item-dao-essence-flower.webp`

### Alchemy (new pills)
- `public/assets/alchemy/ascendant-qi-pill.webp`, `karmic-qi-pill.webp`, `immortal-qi-pill.webp`, `dao-essence-pill.webp`

---

## Crafting set items – images needed

Place images under `public/assets/skilling/{skill}/{tier}-{slot}.webp` (e.g. `public/assets/skilling/alchemy/lesser-helmet.webp`). Same structure as fishing/mining/gathering sets.

### Alchemy (12)
- Lesser Alchemy Helmet, Lesser Alchemy Body, Lesser Alchemy Legs, Lesser Alchemy Shoes
- Greater Alchemy Helmet, Greater Alchemy Body, Greater Alchemy Legs, Greater Alchemy Shoes
- Perfected Alchemy Helmet, Perfected Alchemy Body, Perfected Alchemy Legs, Perfected Alchemy Shoes

### Forging (12)
- Lesser Forging Helmet, Lesser Forging Body, Lesser Forging Legs, Lesser Forging Shoes
- Greater Forging Helmet, Greater Forging Body, Greater Forging Legs, Greater Forging Shoes
- Perfected Forging Helmet, Perfected Forging Body, Perfected Forging Legs, Perfected Forging Shoes

### Cooking (12)
- Lesser Cooking Helmet, Lesser Cooking Body, Lesser Cooking Legs, Lesser Cooking Shoes
- Greater Cooking Helmet, Greater Cooking Body, Greater Cooking Legs, Greater Cooking Shoes
- Perfected Cooking Helmet, Perfected Cooking Body, Perfected Cooking Legs, Perfected Cooking Shoes
