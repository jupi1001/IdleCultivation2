/** One-time path choice at game start. Affects sects and cultivation tree later. */
export const CULTIVATION_PATHS = ["Righteous", "Demonic"] as const;
export type CultivationPath = (typeof CULTIVATION_PATHS)[number];

export function isCultivationPath(s: string): s is CultivationPath {
  return CULTIVATION_PATHS.includes(s as CultivationPath);
}
