/**
 * Generates skilling analysis: actions and time per level for each skill (1→99).
 * Run: node scripts/generate-skilling-stats.mjs
 * Output: docs/SKILLING_ANALYSIS.md
 *
 * Reference: Melvor Idle backloads XP (1→92 ≈ 92→99 in total XP). We use a power curve: floor(6 × L^1.25).
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = `${__dirname}/../docs/SKILLING_ANALYSIS.md`;

// Backloaded curve (Melvor-style): XP for L→L+1 = floor(BASE × L^EXP). Same as fishingLevel.ts, miningLevel.ts, gatheringLevel.ts.
const XP_CURVE_BASE = 10;
const XP_CURVE_EXPONENT = 1.25;

function xpRequiredForNextLevel(level, maxLevel = 99) {
  if (level >= maxLevel) return 0;
  return Math.floor(XP_CURVE_BASE * Math.pow(level, XP_CURVE_EXPONENT));
}

function totalXpForLevel(level) {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevel(L, 99);
  }
  return sum;
}

// Craft curve (Cooking, Alchemy, Forging): more generous, same shape. Same as cooking.ts, alchemy.ts, forging.ts.
const CRAFT_XP_BASE = 4;
const CRAFT_XP_EXPONENT = 1.25;

function xpRequiredForNextLevelCraft(level, maxLevel = 99) {
  if (level >= maxLevel) return 0;
  return Math.floor(CRAFT_XP_BASE * Math.pow(level, CRAFT_XP_EXPONENT));
}

function totalXpForLevelCraft(level) {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevelCraft(L, 99);
  }
  return sum;
}

function getCookingXP(recipeLevel) {
  return Math.max(1, Math.floor(2 * recipeLevel));
}
function getAlchemyXPSuccess(recipeLevel) {
  return Math.max(1, Math.floor(2.5 * recipeLevel));
}
function getAlchemyXPFail(recipeLevel) {
  return Math.max(0, Math.floor(0.6 * recipeLevel));
}
function getForgingXPRefine(tierIndex) {
  return Math.max(1, 4 + 3 * tierIndex);
}
function getForgingXPCraft(tierIndex) {
  return Math.max(1, 6 + 4 * tierIndex);
}

const FORGING_TIER_ORDER = [
  "Copper", "Iron", "Spirit", "Tin", "Jade", "Silver", "Gold", "Obsidian",
  "Thunder Crystal", "Star Iron", "Voidstone", "Dragonbone", "Celestial",
];

// Fishing: { unlockTotalXp, xpPerAction, delayMs }
const FISHING_AREAS = [
  { unlock: 0, xp: 1, delay: 3000 },
  { unlock: totalXpForLevel(8), xp: 2, delay: 3500 },
  { unlock: totalXpForLevel(16), xp: 4, delay: 4000 },
  { unlock: totalXpForLevel(24), xp: 7, delay: 4500 },
  { unlock: totalXpForLevel(32), xp: 11, delay: 5000 },
  { unlock: totalXpForLevel(41), xp: 16, delay: 5500 },
  { unlock: totalXpForLevel(50), xp: 22, delay: 6000 },
  { unlock: totalXpForLevel(59), xp: 30, delay: 6500 },
  { unlock: totalXpForLevel(68), xp: 40, delay: 7000 },
  { unlock: totalXpForLevel(76), xp: 55, delay: 7500 },
  { unlock: totalXpForLevel(83), xp: 65, delay: 7800 },
  { unlock: totalXpForLevel(88), xp: 70, delay: 8000 },
  { unlock: totalXpForLevel(92), xp: 75, delay: 8200 },
  { unlock: totalXpForLevel(96), xp: 82, delay: 8500 },
  { unlock: totalXpForLevel(99), xp: 95, delay: 9000 },
];

// Mining
const MINING_AREAS = [
  { unlock: totalXpForLevel(1), xp: 1, delay: 4000 },
  { unlock: totalXpForLevel(5), xp: 2, delay: 5000 },
  { unlock: totalXpForLevel(10), xp: 4, delay: 6000 },
  { unlock: totalXpForLevel(15), xp: 5, delay: 6200 },
  { unlock: totalXpForLevel(20), xp: 7, delay: 6500 },
  { unlock: totalXpForLevel(30), xp: 9, delay: 7000 },
  { unlock: totalXpForLevel(40), xp: 12, delay: 7600 },
  { unlock: totalXpForLevel(50), xp: 16, delay: 8200 },
  { unlock: totalXpForLevel(50), xp: 18, delay: 8500 },
  { unlock: totalXpForLevel(60), xp: 24, delay: 9000 },
  { unlock: totalXpForLevel(70), xp: 32, delay: 9800 },
  { unlock: totalXpForLevel(80), xp: 42, delay: 10500 },
  { unlock: totalXpForLevel(90), xp: 58, delay: 11500 },
  { unlock: totalXpForLevel(95), xp: 70, delay: 12500 },
];

// Gathering
const GATHERING_AREAS = [
  { unlock: totalXpForLevel(1), xp: 1, delay: 4000 },
  { unlock: totalXpForLevel(1), xp: 1, delay: 4000 },
  { unlock: totalXpForLevel(8), xp: 2, delay: 4500 },
  { unlock: totalXpForLevel(16), xp: 4, delay: 5000 },
  { unlock: totalXpForLevel(24), xp: 6, delay: 5500 },
  { unlock: totalXpForLevel(32), xp: 8, delay: 6000 },
  { unlock: totalXpForLevel(41), xp: 10, delay: 6500 },
  { unlock: totalXpForLevel(50), xp: 12, delay: 7000 },
  { unlock: totalXpForLevel(59), xp: 14, delay: 7500 },
  { unlock: totalXpForLevel(68), xp: 16, delay: 8000 },
  { unlock: totalXpForLevel(76), xp: 20, delay: 8500 },
  { unlock: totalXpForLevel(83), xp: 24, delay: 9000 },
  { unlock: totalXpForLevel(88), xp: 28, delay: 9500 },
  { unlock: totalXpForLevel(92), xp: 34, delay: 10000 },
  { unlock: totalXpForLevel(99), xp: 42, delay: 11000 },
];

function bestAreaAtTotalXp(areas, totalXp) {
  let best = areas[0];
  for (const a of areas) {
    if (a.unlock <= totalXp && (best.unlock < a.unlock || (best.unlock === a.unlock && a.xp > best.xp)))
      best = a;
  }
  return best;
}

function analyzeTimedSkill(name, areas, maxLevel = 99) {
  const rows = [];
  let totalActions = 0;
  let totalTimeMs = 0;
  for (let L = 1; L < maxLevel; L++) {
    const xpNeeded = xpRequiredForNextLevel(L, maxLevel);
    const totalXpAtL = totalXpForLevel(L);
    const area = bestAreaAtTotalXp(areas, totalXpAtL);
    const actions = Math.ceil(xpNeeded / area.xp);
    const timeMs = actions * area.delay;
    totalActions += actions;
    totalTimeMs += timeMs;
    rows.push({
      level: L,
      xpNeeded,
      areaXp: area.xp,
      areaDelay: area.delay,
      actions,
      timeMs,
    });
  }
  return { name, rows, totalActions, totalTimeMs };
}

function formatTime(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const s2 = s % 60;
  if (m < 60) return s2 ? `${m}m ${s2}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const m2 = m % 60;
  return m2 ? `${h}h ${m2}m` : `${h}h`;
}

function buildMarkdown() {
  const fishing = analyzeTimedSkill("Fishing", FISHING_AREAS);
  const mining = analyzeTimedSkill("Mining", MINING_AREAS);
  const gathering = analyzeTimedSkill("Gathering", GATHERING_AREAS);

  const sampleLevels = [1, 2, 5, 10, 20, 30, 50, 70, 90, 98];
  const lines = [
    "# Skilling Analysis: Actions and Time per Level (1–99)",
    "",
    "This document shows **actions** and **time** required to go from level L to L+1 for each skill, assuming the best available area/action at that level. Used to compare progression and tune XP curves (reference: RuneScape / Melvor Idle).",
    "",
    "---",
    "",
    "## Current XP curve (Fishing, Mining, Gathering)",
    "",
    "- **Backloaded (Melvor-style):** XP for next level = `floor(10 × L^1.25)`. Early levels need less XP, late levels need more.",
    "- **Examples:** 1→2 = 10 XP, 20→21 ≈ 422 XP, 98→99 ≈ 3,070 XP.",
    "- **Total XP to level 99:** ~203,000. Fishing ~10h with best areas.",
    "",
    "## Reference: Melvor Idle",
    "",
    "Melvor uses a **non-linear** curve: XP between L-1 and L ≈ `floor(1/4 × (L−1 + 300×2^((L−1)/7)))`. Total XP 1→99 ≈ 13M; XP from 1→92 ≈ XP from 92→99 (heavy back-load). We use a much flatter curve so 1–99 is achievable in reasonable time.",
    "",
    "---",
    "",
    "## 1. Fishing",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|",
  ];

  for (const L of sampleLevels) {
    const r = fishing.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Fishing total (1→99):** " +
      `${fishing.totalActions.toLocaleString()} actions, ${formatTime(fishing.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 2. Mining",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels) {
    const r = mining.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Mining total (1→99):** " +
      `${mining.totalActions.toLocaleString()} actions, ${formatTime(mining.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 3. Gathering",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels) {
    const r = gathering.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Gathering total (1→99):** " +
      `${gathering.totalActions.toLocaleString()} actions, ${formatTime(gathering.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 4. Forging, Cooking, Alchemy (crafting)",
    "",
    "No fixed **time** per action (instant click). All three use a **backloaded XP curve** (same shape as gathering but more generous): `floor(4 × L^1.25)` XP per level. **XP per action scales by recipe tier** so early crafts give less, late crafts give more.",
    "",
    "- **Cooking:** `recipeLevel` 1–22 per recipe. XP per cook = `floor(2 × recipeLevel)` (e.g. 2 for Grilled Carp, 44 for Mythic Pearl Eel).",
    "- **Alchemy:** `recipeLevel` 1–35 per pill. Success XP = `floor(2.5 × recipeLevel)` (e.g. 2 for Basic Qi Pill, 87 for Transcendent). Fail XP = `floor(0.6 × recipeLevel)` (0–21).",
    "- **Forging:** Tier index 0–12 (Copper→Celestial). Refine XP = `4 + 3×tierIndex` (4–40). Craft XP = `6 + 4×tierIndex` (6–54).",
    "",
    "Total XP to level 99 (craft curve): ~81,000. Consumable skills are more generous than gathering to account for item cost and alchemy failure.",
    "",
    "### 4a. Cooking – XP per recipe and actions to level",
    "",
    "XP per cook = `floor(2 × recipeLevel)`. Early fish (e.g. Grilled Carp, recipe level 1) give 2 XP; late fish (e.g. Mythic Pearl Eel, recipe level 22) give 44 XP.",
    "",
    "| Recipe level | XP per cook |",
    "|--------------|-------------|",
    ...Array.from({ length: 22 }, (_, i) => {
      const r = i + 1;
      return `| ${r} | ${getCookingXP(r)} |`;
    }),
    "",
    "**Actions needed to gain one cooking level** (if using only that recipe):",
    "",
    "| Skill level → next | XP needed | Cooks (recipe L22, 44 XP) | Cooks (recipe L11, 22 XP) |",
    "|--------------------|------------|----------------------------|----------------------------|",
    ...(function () {
      const out = [];
      for (const L of [1, 10, 30, 50, 98]) {
        const xp = xpRequiredForNextLevelCraft(L, 99);
        const with22 = Math.ceil(xp / getCookingXP(22));
        const with11 = Math.ceil(xp / getCookingXP(11));
        out.push(`| ${L}→${L + 1} | ${xp} | ${with22} | ${with11} |`);
      }
      return out;
    })(),
    "",
    "### 4b. Alchemy – XP per recipe (success vs fail) and actions to level",
    "",
    "Success XP = `floor(2.5 × recipeLevel)`; fail XP = `floor(0.6 × recipeLevel)`. Failures still grant some XP so progress is not lost.",
    "",
    "| Recipe level | Success XP | Fail XP | Example: 50→51 (531 XP) at 100% success | at 70% success (expected XP ≈ 67) |",
    "|--------------|------------|---------|--------------------------------------------|------------------------------------|",
    ...(function () {
      const levels = [1, 5, 10, 15, 20, 25, 30, 35];
      const exampleXp = xpRequiredForNextLevelCraft(50, 99); // 531
      const out = [];
      for (const r of levels) {
        const succ = getAlchemyXPSuccess(r);
        const fail = getAlchemyXPFail(r);
        const acts100 = Math.ceil(exampleXp / succ);
        const exp70 = 0.7 * succ + 0.3 * fail;
        const acts70 = Math.ceil(exampleXp / exp70);
        out.push(`| ${r} | ${succ} | ${fail} | ${acts100} attempts | ${Math.round(acts70)} attempts |`);
      }
      return out;
    })(),
    "",
    "**Sample actions to gain one level (assuming 100% success with best recipe, L35):**",
    "",
    "| Skill level → next | XP needed | Attempts (87 XP each) |",
    "|--------------------|------------|------------------------|",
    ...(function () {
      const out = [];
      for (const L of [1, 10, 30, 50, 98]) {
        const xp = xpRequiredForNextLevelCraft(L, 99);
        const attempts = Math.ceil(xp / getAlchemyXPSuccess(35));
        out.push(`| ${L}→${L + 1} | ${xp} | ${attempts} |`);
      }
      return out;
    })(),
    "",
    "### 4c. Forging – XP per tier (refine vs craft) and actions to level",
    "",
    "Refine XP = `4 + 3×tierIndex`; craft XP = `6 + 4×tierIndex`. Copper = tier 0, Celestial = tier 12.",
    "",
    "| Tier index | Tier name | Refine XP | Craft XP | Refines for 50→51 (531 XP) | Crafts for 50→51 |",
    "|------------|-----------|-----------|----------|-----------------------------|------------------|",
    ...(function () {
      const out = [];
      const exampleXp = xpRequiredForNextLevelCraft(50, 99); // 531
      for (let i = 0; i < FORGING_TIER_ORDER.length; i++) {
        const ref = getForgingXPRefine(i);
        const cr = getForgingXPCraft(i);
        const refines = Math.ceil(exampleXp / ref);
        const crafts = Math.ceil(exampleXp / cr);
        out.push(`| ${i} | ${FORGING_TIER_ORDER[i]} | ${ref} | ${cr} | ${refines} | ${crafts} |`);
      }
      return out;
    })(),
    "",
    "**Sample actions to gain one level (best tier, Celestial):**",
    "",
    "| Skill level → next | XP needed | Refines (40 XP) | Crafts (54 XP) |",
    "|--------------------|------------|-----------------|----------------|",
    ...(function () {
      const out = [];
      for (const L of [1, 10, 30, 50, 98]) {
        const xp = xpRequiredForNextLevelCraft(L, 99);
        const refines = Math.ceil(xp / getForgingXPRefine(12));
        const crafts = Math.ceil(xp / getForgingXPCraft(12));
        out.push(`| ${L}→${L + 1} | ${xp} | ${refines} | ${crafts} |`);
      }
      return out;
    })(),
    "",
    "---",
    "",
    "## 5. Full table (every level) – Fishing",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );

  fishing.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "## 6. Full table – Mining",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );
  mining.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "## 7. Full table – Gathering",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );
  gathering.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "---",
    "",
    "*Generated by `scripts/generate-skilling-stats.mjs`*",
    "",
    "---",
    "",
    "## 8. Recommendations (curve adjustment)",
    "",
    "| Skill    | Total actions (1→99) | Total time |",
    "|----------|----------------------|------------|",
    `| Fishing  | ${fishing.totalActions.toLocaleString()} | ${formatTime(fishing.totalTimeMs)} |`,
    `| Mining   | ${mining.totalActions.toLocaleString()} | ${formatTime(mining.totalTimeMs)} |`,
    `| Gathering| ${gathering.totalActions.toLocaleString()} | ${formatTime(gathering.totalTimeMs)} |`,
    "",
    "- **Fishing** is fastest (~10h) because high-level areas give 70–95 XP/catch with moderate delays.",
    "- **Gathering** is slowest (~19.5h) due to lower XP per action and longer delays at high levels.",
    "- **Mining** sits in between (~15h).",
    "",
    "To smooth progression (RuneScape/Melvor reference):",
    "",
    "1. **Softer early game:** Use a lower XP-per-level base (e.g. `20 × L` instead of `25 × L`) so levels 1–30 need fewer actions and total time to 99 drops by ~20%.",
    "2. **More areas or higher XP in mid tiers:** Add or buff areas around levels 20–50 so time-per-level doesn’t spike before the next unlock.",
    "3. **Crafting (Forging/Cooking/Alchemy):** Backloaded curve (`4×L^1.25`) with XP per action scaled by recipe/tier; see §4a–4c above for tables.",
    ""
  );

  return lines.join("\n");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, buildMarkdown(), "utf8");
console.log("Wrote", OUT_PATH);
