# Idle Cultivation 2

A browser-based idle game where you cultivate qi, break through realms, join sects, and explore combat, fishing, mining, alchemy, and more.

## How to play

1. **Run the game** (see below).
2. Open the game in your browser. Progress is saved automatically in this browser.
3. Choose your path (Righteous or Demonic), then explore the map, meditate, train, and unlock new areas and sects.

## Keyboard shortcuts

These work when focus is not in an input field. You can also see them in **Settings → Keyboard Shortcuts**.

| Key | Action |
|-----|--------|
| **M** | Map |
| **S** | Sect |
| **I** | Inventory |
| **T** | Training |
| **F** | Fishing |
| **G** | Gathering |
| **N** | Mining |
| **P** | Shop |
| **C** | Cultivation Tree |
| **A** | Achievements |
| **L** | Activity Log |
| **E** | Stats |
| **Esc** | Close modal / back to Map |
| **1–9** | Use vitality (healing) food in combat (first 9 healing items) |

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

**Build for production:**

```bash
npm run build
npm run preview
```

## For developers

- **Roadmap and ideas:** See [TODO.md](TODO.md) for planned features and changes (updated frequently).
- **Skilling stats (1–99):** See [docs/SKILLING_ANALYSIS.md](docs/SKILLING_ANALYSIS.md) for actions and time per level for Fishing, Mining, Gathering, Forging, Cooking, and Alchemy, and for the XP curve reference.
