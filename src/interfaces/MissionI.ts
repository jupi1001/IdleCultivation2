import type { RealmRequirement } from "../constants/areaRealmRequirements";

export interface MissionRareDrop {
  /** Item id (expedition-only technique or herb) */
  itemId: number;
  /** Chance 0–1 (e.g. 0.15 = 15%) */
  chance: number;
}

export interface MissionI {
  id: number;
  name: string;
  description: string;
  /** Duration in seconds (under 300 for Phase 1) */
  durationSeconds: number;
  requiredRealm: RealmRequirement;
  spiritStonesMin: number;
  spiritStonesMax: number;
  /** One-time rare drops; if player already has the item they don't get it again from this mission */
  rareDrops: MissionRareDrop[];
}
