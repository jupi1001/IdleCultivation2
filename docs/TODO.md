# TODO

- Add more combat loot
- Add misc items like rings, amulets
- **Rings & amulets – images to generate** (place under `public/assets/forging/`):
  - **Rings** (`ring/*.webp`): Spirit Gathering Ring, Meridian Flow Ring, Earth Root Ring, Jade Pulse Ring, Thunder Spark Ring, Void Whisper Ring, Dragon Vein Ring, Celestial Glow Ring, Moonlit Reflection Ring, Primordial Seal Ring.
  - **Amulets** (`amulet/*.webp`): Clear Mind Amulet, Guardian Talisman, Blood Qi Pendant, Star Anchor Amulet, Demon Ward Amulet, Heaven's Breath Amulet, Eight Meridian Amulet, Spirit Herb Charm, Void Refuge Amulet, Transcendent Dao Amulet.
  - **Exact filenames**: `ring/spirit-gathering-ring.webp`, `ring/meridian-flow-ring.webp`, `ring/earth-root-ring.webp`, `ring/jade-pulse-ring.webp`, `ring/thunder-spark-ring.webp`, `ring/void-whisper-ring.webp`, `ring/dragon-vein-ring.webp`, `ring/celestial-glow-ring.webp`, `ring/moonlit-reflection-ring.webp`, `ring/primordial-seal-ring.webp`, `amulet/clear-mind-amulet.webp`, `amulet/guardian-talisman.webp`, `amulet/blood-qi-pendant.webp`, `amulet/star-anchor-amulet.webp`, `amulet/demon-ward-amulet.webp`, `amulet/heavens-breath-amulet.webp`, `amulet/eight-meridian-amulet.webp`, `amulet/spirit-herb-charm.webp`, `amulet/void-refuge-amulet.webp`, `amulet/transcendent-dao-amulet.webp`.
- Add images for combat techniques and qi techniques
- Add shoes and legs (maybe only for skilling sets)
- All skill expansion with content to level 99
- **Immortals Island (Phase 2)** – Avatars, “send avatar” flow

  **Phase 2 – Avatars**:
  - **Avatar**: A second “character” that can be sent on expeditions so the **main** can keep cultivating. Add `avatars: AvatarI[]` to state; each has `id`, `name`, `power` (single stat, no attack/defense/health), `isBusy`, `expeditionEndTime`. Increase power via: (1) avatar meditation when not on expedition; (2) main spends qi pills (or spirit stones) to train avatar.
  - **Unlock**: Unlock “Create Avatar” at a certain realm or after first Immortals Island mission. Creating an avatar could cost spirit stones and/or qi.
  - **Flow**: Choose mission → choose “Main” or one of the avatars → start timer. Only the chosen entity is busy; others can continue their activities. Main continues cultivating; avatars only do expeditions (or you can later let them “train” offline).

- Sect phase 2
  - **To get items from the demonic sect you have to battle them. So if you are a core disciple in your righteous sect you can battle a demonic sect and then get the loot from a loot table up to the core disciple level.**

- All skill expansion with content to level 120


-- **Auto-loot** – Option to send loot to inventory automatically on kill (QoL).
- **Death penalty (optional)** – Currently on death you only clear loot and leave. Some games add a light penalty (e.g. gold loss, short debuff).
- **Polish** – Sound and VFX (hits, blocks, kill), tooltips (e.g. how block/damage work).
