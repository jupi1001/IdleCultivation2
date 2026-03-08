/**
 * Typed route state for content navigation (Task 4).
 * Replaces string-based page (e.g. "Combat:AreaName") with a discriminated union.
 * Route is the source of truth; persisted as-is so serialization is stable.
 */
import { ContentArea } from "../../enum/ContentArea";

export type ContentRoute =
  | { type: "map" }
  | { type: "sect" }
  | { type: "training" }
  | { type: "combat"; areaId: string }
  | { type: "shop" }
  | { type: "black_market" }
  | { type: "inventory" }
  | { type: "labour" }
  | { type: "meditation" }
  | { type: "fishing" }
  | { type: "mining" }
  | { type: "gathering" }
  | { type: "cultivation_tree" }
  | { type: "alchemy" }
  | { type: "forging" }
  | { type: "cooking" }
  | { type: "immortals_island" }
  | { type: "reincarnation" }
  | { type: "achievements" }
  | { type: "settings" }
  | { type: "activity_log" }
  | { type: "stats" };

const CONTENT_AREA_TO_ROUTE_TYPE: Record<ContentArea, ContentRoute["type"]> = {
  [ContentArea.MAP]: "map",
  [ContentArea.SECT]: "sect",
  [ContentArea.TRAINING]: "training",
  [ContentArea.COMBAT]: "combat",
  [ContentArea.SHOP]: "shop",
  [ContentArea.BLACK_MARKET]: "black_market",
  [ContentArea.INVENTORY]: "inventory",
  [ContentArea.LABOUR]: "labour",
  [ContentArea.MEDITATION]: "meditation",
  [ContentArea.FISHING]: "fishing",
  [ContentArea.MINING]: "mining",
  [ContentArea.GATHERING]: "gathering",
  [ContentArea.CULTIVATION_TREE]: "cultivation_tree",
  [ContentArea.ALCHEMY]: "alchemy",
  [ContentArea.FORGING]: "forging",
  [ContentArea.COOKING]: "cooking",
  [ContentArea.IMMORTALS_ISLAND]: "immortals_island",
  [ContentArea.REINCARNATION]: "reincarnation",
  [ContentArea.ACHIEVEMENTS]: "achievements",
  [ContentArea.SETTINGS]: "settings",
  [ContentArea.ACTIVITY_LOG]: "activity_log",
  [ContentArea.STATS]: "stats",
};

/** Parse legacy page string (e.g. "Map" or "Combat:Village Outskirts") into ContentRoute. */
export function parseLegacyPage(page: string): ContentRoute {
  if (page.startsWith("Combat:")) {
    const areaId = page.slice("Combat:".length);
    return { type: "combat", areaId };
  }
  const area = page as ContentArea;
  const routeType = CONTENT_AREA_TO_ROUTE_TYPE[area];
  if (routeType === "combat") return { type: "combat", areaId: "" };
  return { type: routeType ?? "map" };
}

/** Convert ContentRoute to legacy page string for backward compatibility where needed. */
export function routeToLegacyPage(route: ContentRoute): string {
  if (route.type === "combat") return `${ContentArea.COMBAT}:${route.areaId}`;
  const entry = Object.entries(CONTENT_AREA_TO_ROUTE_TYPE).find(([, t]) => t === route.type);
  return entry ? entry[0] : ContentArea.MAP;
}

/** Check if route is a given content area (no params). */
export function isRouteType(route: ContentRoute, area: ContentArea): boolean {
  if (area === ContentArea.COMBAT) return route.type === "combat";
  return CONTENT_AREA_TO_ROUTE_TYPE[area] === route.type;
}

/** Get combat areaId when route is combat, otherwise undefined. */
export function getCombatAreaId(route: ContentRoute): string | undefined {
  return route.type === "combat" ? route.areaId : undefined;
}

/** Build ContentRoute from ContentArea; for combat pass areaId. */
export function routeFromArea(area: ContentArea, combatAreaId?: string): ContentRoute {
  if (area === ContentArea.COMBAT)
    return { type: "combat", areaId: combatAreaId ?? "" };
  const t = CONTENT_AREA_TO_ROUTE_TYPE[area];
  return { type: t ?? "map" } as ContentRoute;
}

/** Map skill display name (left panel) to ContentRoute. Use instead of parseLegacyPage for navigation. */
const SKILL_NAME_TO_CONTENT_AREA: Record<string, ContentArea> = {
  "Martial Training": ContentArea.TRAINING,
  "Meditation": ContentArea.MEDITATION,
  "Immortals Island": ContentArea.IMMORTALS_ISLAND,
  "Labour": ContentArea.LABOUR,
  "Fishing": ContentArea.FISHING,
  "Mining": ContentArea.MINING,
  "Gathering": ContentArea.GATHERING,
  "Alchemy": ContentArea.ALCHEMY,
  "Forging": ContentArea.FORGING,
  "Cooking": ContentArea.COOKING,
  "Reincarnation": ContentArea.REINCARNATION,
};

/** Get ContentRoute for a skill panel name (e.g. "Fishing", "Martial Training"). No string parsing. */
export function routeForSkillName(skillName: string): ContentRoute {
  const area = SKILL_NAME_TO_CONTENT_AREA[skillName];
  return area != null ? routeFromArea(area) : { type: "map" };
}
