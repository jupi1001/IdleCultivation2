import type { CultivationPath } from "../constants/cultivationPath";

export interface SectI {
  id: number;
  name: string;
  description: string;
  /** Righteous or Demonic – only sects matching character path are joinable. */
  path: CultivationPath;
  /** Position on map as percentage (0–100). Used for placing the sect pin. */
  positionX: number;
  positionY: number;
}

export default SectI;
