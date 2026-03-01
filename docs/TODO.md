# TODO

## Images to add:
- **Rings & amulets – images to generate** (place under `public/assets/forging/`):
  ring/spirit-gathering-ring.webp`, 
`ring/meridian-flow-ring.webp`, 
`ring/earth-root-ring.webp`, 
`ring/jade-pulse-ring.webp`, 
`ring/thunder-spark-ring.webp`, 
`ring/void-whisper-ring.webp`, 
`ring/dragon-vein-ring.webp`, 
`ring/celestial-glow-ring.webp`, 
`ring/moonlit-reflection-ring.webp`, 
`ring/primordial-seal-ring.webp`, 

`amulet/clear-mind-amulet.webp`, 
`amulet/guardian-talisman.webp`, 
`amulet/blood-qi-pendant.webp`, 
`amulet/star-anchor-amulet.webp`, 
`amulet/demon-ward-amulet.webp`, 
`amulet/heavens-breath-amulet.webp`, 
`amulet/eight-meridian-amulet.webp`, 
`amulet/spirit-herb-charm.webp`, 
`amulet/void-refuge-amulet.webp`, 
`amulet/transcendent-dao-amulet.webp`.

Skill icons:
  Fishing: "/assets/fishing/skill-icon.webp",
  Mining: "/assets/mining/skill-icon.webp",
  Gathering: "/assets/gathering/skill-icon.webp",
  Cooking: "/assets/cooking/skill-icon.webp",
  Alchemy: "/assets/alchemy/skill-icon.webp",
  Forging: "/assets/forging/skill-icon.webp",



- **Skilling sets – images to generate** (place under `public/assets/skilling/`):
  - **Fishing** (lesser, greater, perfected × helmet, body, legs, shoes):
    `fishing/lesser-helmet.webp`, `fishing/lesser-body.webp`, `fishing/lesser-legs.webp`, `fishing/lesser-shoes.webp`,
    `fishing/greater-helmet.webp`, `fishing/greater-body.webp`, `fishing/greater-legs.webp`, `fishing/greater-shoes.webp`,
    `fishing/perfected-helmet.webp`, `fishing/perfected-body.webp`, `fishing/perfected-legs.webp`, `fishing/perfected-shoes.webp`.
  - **Mining** (same structure):
    `mining/lesser-helmet.webp`, `mining/lesser-body.webp`, `mining/lesser-legs.webp`, `mining/lesser-shoes.webp`,
    `mining/greater-helmet.webp`, `mining/greater-body.webp`, `mining/greater-legs.webp`, `mining/greater-shoes.webp`,
    `mining/perfected-helmet.webp`, `mining/perfected-body.webp`, `mining/perfected-legs.webp`, `mining/perfected-shoes.webp`.
  - **Gathering** (same structure):
    `gathering/lesser-helmet.webp`, `gathering/lesser-body.webp`, `gathering/lesser-legs.webp`, `gathering/lesser-shoes.webp`,
    `gathering/greater-helmet.webp`, `gathering/greater-body.webp`, `gathering/greater-legs.webp`, `gathering/greater-shoes.webp`,
    `gathering/perfected-helmet.webp`, `gathering/perfected-body.webp`, `gathering/perfected-legs.webp`, `gathering/perfected-shoes.webp`.


## Minor Version

Create a plan
Cleanup. You are a senior react engineer. YOur job is to simplify and use best practices in this project. Reduce dependencies, use DRY princliple. Make the project easily scalable for future additions for items, items that give bonuses to skills and unique items dropped by enemies. Anaylze the current appraoch. Make sure the entire game logic flow is solid. Deeply inspect the skill action to make sure it is always transactional. So no double actions can be counted and always just one action is running at the same time. Try to optimize the components, dependencies and structure based on best react principles so it is easily maintainable. Add interfaces or other things to help. If there is similar logic like one time obtainable items used in different context make sure to centralize it and find a abtract, easily usable at different places, solution.

## Next Version
- Skill sets for alchemy, forging, cooking
- Add more combat loot
- Sect phase 2
  - **To get items from the demonic sect you have to battle them. So if you are a core disciple in your righteous sect you can battle a demonic sect and then get the loot from a loot table up to the core disciple level.**

- All skill expansion with content to level 120


-- **Auto-loot** – Option to send loot to inventory automatically on kill (QoL).
- **Death penalty (optional)** – Currently on death you only clear loot and leave. Some games add a light penalty (e.g. gold loss, short debuff).
- **Polish** – Sound and VFX (hits, blocks, kill), tooltips (e.g. how block/damage work).
