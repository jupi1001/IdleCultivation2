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

// Backloaded curve. Per-skill BASE so 1→99 ~50h and 99→120 ~150h for each skill.
const XP_CURVE_BASE_FISHING = 50;
const XP_CURVE_BASE_MINING = 32;
const XP_CURVE_BASE_GATHERING = 25;
const XP_CURVE_EXPONENT = 1.25;
const POST_99_XP_MULTIPLIER_FISHING = 16.5;
const POST_99_XP_MULTIPLIER_MINING = 14.75;
const POST_99_XP_MULTIPLIER_GATHERING = 13.15;

function getXpBase(skill) {
  if (skill === "Fishing") return XP_CURVE_BASE_FISHING;
  if (skill === "Mining") return XP_CURVE_BASE_MINING;
  return XP_CURVE_BASE_GATHERING;
}

function getPost99Multiplier(skill) {
  if (skill === "Fishing") return POST_99_XP_MULTIPLIER_FISHING;
  if (skill === "Mining") return POST_99_XP_MULTIPLIER_MINING;
  return POST_99_XP_MULTIPLIER_GATHERING;
}

function xpRequiredForNextLevel(level, maxLevel = 120, skill = "Fishing") {
  if (level >= maxLevel) return 0;
  const base = Math.floor(getXpBase(skill) * Math.pow(level, XP_CURVE_EXPONENT));
  return level >= 99 ? Math.floor(base * getPost99Multiplier(skill)) : base;
}

function totalXpForLevel(level, maxLevel = 120, skill = "Fishing") {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevel(L, maxLevel, skill);
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

function totalXpForLevelCraft(level, maxLevel = 120) {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredForNextLevelCraft(L, maxLevel);
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
  "Ascendant", "Karmic", "Immortal", "Dao",
];

// Fishing: { unlockTotalXp, xpPerAction, delayMs }. 1-99 then 105,110,115,120 (reincarnation).
function getFishingAreas() {
  const t = (l) => totalXpForLevel(l, 120, "Fishing");
  return [
    { unlock: 0, xp: 1, delay: 3000 },
    { unlock: t(8), xp: 2, delay: 3500 },
    { unlock: t(16), xp: 4, delay: 4000 },
    { unlock: t(24), xp: 7, delay: 4500 },
    { unlock: t(32), xp: 11, delay: 5000 },
    { unlock: t(41), xp: 16, delay: 5500 },
    { unlock: t(50), xp: 22, delay: 6000 },
    { unlock: t(59), xp: 30, delay: 6500 },
    { unlock: t(68), xp: 40, delay: 7000 },
    { unlock: t(76), xp: 55, delay: 7500 },
    { unlock: t(83), xp: 65, delay: 7800 },
    { unlock: t(88), xp: 70, delay: 8000 },
    { unlock: t(92), xp: 75, delay: 8200 },
    { unlock: t(96), xp: 82, delay: 8500 },
    { unlock: t(99), xp: 95, delay: 9000 },
    { unlock: t(105), xp: 102, delay: 9200 },
    { unlock: t(110), xp: 110, delay: 9400 },
    { unlock: t(115), xp: 118, delay: 9600 },
    { unlock: t(120), xp: 126, delay: 9800 },
  ];
}

// Mining. 1-99 then 105,110,115,120 (reincarnation).
function getMiningAreas() {
  const t = (l) => totalXpForLevel(l, 120, "Mining");
  return [
    { unlock: t(1), xp: 1, delay: 4000 },
    { unlock: t(5), xp: 2, delay: 5000 },
    { unlock: t(10), xp: 4, delay: 6000 },
    { unlock: t(15), xp: 5, delay: 6200 },
    { unlock: t(20), xp: 7, delay: 6500 },
    { unlock: t(30), xp: 9, delay: 7000 },
    { unlock: t(40), xp: 12, delay: 7600 },
    { unlock: t(50), xp: 16, delay: 8200 },
    { unlock: t(50), xp: 18, delay: 8500 },
    { unlock: t(60), xp: 24, delay: 9000 },
    { unlock: t(70), xp: 32, delay: 9800 },
    { unlock: t(80), xp: 42, delay: 10500 },
    { unlock: t(90), xp: 58, delay: 11500 },
    { unlock: t(95), xp: 70, delay: 12500 },
    { unlock: t(105), xp: 82, delay: 13000 },
    { unlock: t(110), xp: 92, delay: 13500 },
    { unlock: t(115), xp: 102, delay: 14000 },
    { unlock: t(120), xp: 112, delay: 14500 },
  ];
}

// Gathering. 1-99 then 105,110,115,120 (reincarnation).
function getGatheringAreas() {
  const t = (l) => totalXpForLevel(l, 120, "Gathering");
  return [
    { unlock: t(1), xp: 1, delay: 4000 },
    { unlock: t(1), xp: 1, delay: 4000 },
    { unlock: t(8), xp: 2, delay: 4500 },
    { unlock: t(16), xp: 4, delay: 5000 },
    { unlock: t(24), xp: 6, delay: 5500 },
    { unlock: t(32), xp: 8, delay: 6000 },
    { unlock: t(41), xp: 10, delay: 6500 },
    { unlock: t(50), xp: 12, delay: 7000 },
    { unlock: t(59), xp: 14, delay: 7500 },
    { unlock: t(68), xp: 16, delay: 8000 },
    { unlock: t(76), xp: 20, delay: 8500 },
    { unlock: t(83), xp: 24, delay: 9000 },
    { unlock: t(88), xp: 28, delay: 9500 },
    { unlock: t(92), xp: 34, delay: 10000 },
    { unlock: t(99), xp: 42, delay: 11000 },
    { unlock: t(105), xp: 50, delay: 11500 },
    { unlock: t(110), xp: 56, delay: 12000 },
    { unlock: t(115), xp: 62, delay: 12500 },
    { unlock: t(120), xp: 70, delay: 13000 },
  ];
}

function bestAreaAtTotalXp(areas, totalXp) {
  let best = areas[0];
  for (const a of areas) {
    if (a.unlock <= totalXp && (best.unlock < a.unlock || (best.unlock === a.unlock && a.xp > best.xp)))
      best = a;
  }
  return best;
}

function analyzeTimedSkill(name, areas, maxLevel = 120, levelStart = 1) {
  const rows = [];
  let totalActions = 0;
  let totalTimeMs = 0;
  for (let L = levelStart; L < maxLevel; L++) {
    const xpNeeded = xpRequiredForNextLevel(L, maxLevel, name);
    const totalXpAtL = totalXpForLevel(L, maxLevel, name);
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
  const fishing99 = analyzeTimedSkill("Fishing", getFishingAreas(), 99);
  const mining99 = analyzeTimedSkill("Mining", getMiningAreas(), 99);
  const gathering99 = analyzeTimedSkill("Gathering", getGatheringAreas(), 99);

  const fishing120 = analyzeTimedSkill("Fishing", getFishingAreas(), 120);
  const mining120 = analyzeTimedSkill("Mining", getMiningAreas(), 120);
  const gathering120 = analyzeTimedSkill("Gathering", getGatheringAreas(), 120);

  const fishing99to120 = analyzeTimedSkill("Fishing", getFishingAreas(), 120, 99);
  const mining99to120 = analyzeTimedSkill("Mining", getMiningAreas(), 120, 99);
  const gathering99to120 = analyzeTimedSkill("Gathering", getGatheringAreas(), 120, 99);

  const sampleLevels = [1, 2, 5, 10, 20, 30, 50, 70, 90, 98];
  const sampleLevels99to120 = [99, 100, 105, 110, 115, 119];

  const lines = [
    "# Skilling Analysis: Actions and Time per Level (1–99, 99–120, Total 1–120)",
    "",
    "This document shows **actions** and **time** required to go from level L to L+1 for each skill, assuming the best available area/action at that level. **Levels 100–120 require at least one reincarnation** to access the new areas.",
    "",
    "---",
    "",
    "## Current XP curve (Fishing, Mining, Gathering)",
    "",
    "- **Backloaded (Melvor-style):** XP for next level = `floor(BASE × L^1.25)`. BASE is per-skill (Fishing 50, Mining 32, Gathering 25) so 1→99 is ~50h for each. Levels 99+ use a per-skill multiplier (Fishing 16.5×, Mining 14.75×, Gathering 13.15×) so 99→120 takes ~3× as long as 1→99. Max level 120.",
    "- **Examples (Fishing):** 1→2 = 50 XP, 98→99 ≈ 15,400 XP, 119→120 ≈ 24,200 XP.",
    "- **Target time:** 1→99 ~50h, 99→120 ~150h per skill (tuned via per-skill BASE).",
    "",
    "---",
    "",
    "## Summary: Actions and time",
    "",
    "### 1–99 (pre-reincarnation)",
    "",
    "| Skill    | Total actions (1→99) | Total time |",
    "|----------|----------------------|------------|",
    `| Fishing  | ${fishing99.totalActions.toLocaleString()} | ${formatTime(fishing99.totalTimeMs)} |`,
    `| Mining   | ${mining99.totalActions.toLocaleString()} | ${formatTime(mining99.totalTimeMs)} |`,
    `| Gathering| ${gathering99.totalActions.toLocaleString()} | ${formatTime(gathering99.totalTimeMs)} |`,
    "",
    "### 99–120 (requires reincarnation)",
    "",
    "| Skill    | Total actions (99→120) | Total time |",
    "|----------|------------------------|------------|",
    `| Fishing  | ${fishing99to120.totalActions.toLocaleString()} | ${formatTime(fishing99to120.totalTimeMs)} |`,
    `| Mining   | ${mining99to120.totalActions.toLocaleString()} | ${formatTime(mining99to120.totalTimeMs)} |`,
    `| Gathering| ${gathering99to120.totalActions.toLocaleString()} | ${formatTime(gathering99to120.totalTimeMs)} |`,
    "",
    "### Total 1–120",
    "",
    "| Skill    | Total actions (1→120) | Total time |",
    "|----------|----------------------|------------|",
    `| Fishing  | ${fishing120.totalActions.toLocaleString()} | ${formatTime(fishing120.totalTimeMs)} |`,
    `| Mining   | ${mining120.totalActions.toLocaleString()} | ${formatTime(mining120.totalTimeMs)} |`,
    `| Gathering| ${gathering120.totalActions.toLocaleString()} | ${formatTime(gathering120.totalTimeMs)} |`,
    "",
    "---",
    "",
    "## 1. Fishing",
    "",
    "### 1–99 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|",
  ];

  for (const L of sampleLevels) {
    const r = fishing99.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Fishing total (1→99):** " +
      `${fishing99.totalActions.toLocaleString()} actions, ${formatTime(fishing99.totalTimeMs)}.`,
    "",
    "### 99–120 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels99to120) {
    const r = fishing99to120.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Fishing total (99→120):** " +
      `${fishing99to120.totalActions.toLocaleString()} actions, ${formatTime(fishing99to120.totalTimeMs)}.`,
    "",
    "**Fishing total (1→120):** " +
      `${fishing120.totalActions.toLocaleString()} actions, ${formatTime(fishing120.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 2. Mining",
    "",
    "### 1–99 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels) {
    const r = mining99.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Mining total (1→99):** " +
      `${mining99.totalActions.toLocaleString()} actions, ${formatTime(mining99.totalTimeMs)}.`,
    "",
    "### 99–120 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels99to120) {
    const r = mining99to120.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Mining total (99→120):** " +
      `${mining99to120.totalActions.toLocaleString()} actions, ${formatTime(mining99to120.totalTimeMs)}.`,
    "",
    "**Mining total (1→120):** " +
      `${mining120.totalActions.toLocaleString()} actions, ${formatTime(mining120.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 3. Gathering",
    "",
    "### 1–99 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels) {
    const r = gathering99.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Gathering total (1→99):** " +
      `${gathering99.totalActions.toLocaleString()} actions, ${formatTime(gathering99.totalTimeMs)}.`,
    "",
    "### 99–120 sample levels",
    "",
    "| Level | XP needed | Best area XP | Delay/action | Actions | Time (L→L+1) |",
    "|-------|-----------|--------------|---------------|---------|--------------|"
  );

  for (const L of sampleLevels99to120) {
    const r = gathering99to120.rows.find((x) => x.level === L);
    if (!r) continue;
    lines.push(
      `| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.areaXp} | ${r.areaDelay / 1000}s | ${r.actions} | ${formatTime(r.timeMs)} |`
    );
  }

  lines.push(
    "",
    "**Gathering total (99→120):** " +
      `${gathering99to120.totalActions.toLocaleString()} actions, ${formatTime(gathering99to120.totalTimeMs)}.`,
    "",
    "**Gathering total (1→120):** " +
      `${gathering120.totalActions.toLocaleString()} actions, ${formatTime(gathering120.totalTimeMs)}.`,
    "",
    "---",
    "",
    "## 4. Forging, Cooking, Alchemy (crafting)",
    "",
    "No fixed **time** per action (instant click). All three use a **backloaded XP curve** (same shape as gathering but more generous): `floor(4 × L^1.25)` XP per level, max 120. **XP per action scales by recipe tier** so early crafts give less, late crafts give more.",
    "",
    "- **Cooking:** `recipeLevel` 1–26 per recipe. XP per cook = `floor(2 × recipeLevel)`.",
    "- **Alchemy:** `recipeLevel` 1–42 per pill. Success XP = `floor(2.5 × recipeLevel)`. Fail XP = `floor(0.6 × recipeLevel)`.",
    "- **Forging:** Tier index 0–16 (Copper→Dao). Refine XP = `4 + 3×tierIndex` (4–52). Craft XP = `6 + 4×tierIndex` (6–70).",
    "",
    "---",
    "",
    "## 5. Full table (every level) – Fishing 1→120",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );

  fishing120.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "## 6. Full table – Mining 1→120",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );
  mining120.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "## 7. Full table – Gathering 1→120",
    "",
    "| L→L+1 | XP | Actions | Time |",
    "|-------|-----|---------|------|"
  );
  gathering120.rows.forEach((r) => {
    lines.push(`| ${r.level}→${r.level + 1} | ${r.xpNeeded} | ${r.actions} | ${formatTime(r.timeMs)} |`);
  });

  lines.push(
    "",
    "---",
    "",
    "*Generated by `scripts/generate-skilling-stats.mjs`*"
  );

  return lines.join("\n");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, buildMarkdown(), "utf8");
console.log("Wrote", OUT_PATH);
