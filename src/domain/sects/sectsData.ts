/**
 * Sect list and path descriptions for the world map and path choice screen.
 */
import type { CultivationPath } from "../../constants/cultivationPath";
import type SectI from "../../interfaces/SectI";

/** Short descriptions for the Righteous vs Demonic path choice at game start. */
export const pathDescriptions: Record<CultivationPath, { title: string; description: string }> = {
  Righteous: { title: "Righteous Path", description: "Walk the path of virtue. Righteous sects and talents will open to you." },
  Demonic: { title: "Demonic Path", description: "Embrace the demonic way. Demonic sects and darker talents await." },
};

/** Sects on the world map. 3 Righteous, 3 Demonic. positionX/Y are percentage (0–100) for map pin. */
export const sectsData: SectI[] = [
  { id: 1, name: "Jade Mountain Sect", description: "A righteous sect known for sword arts and strict discipline.", path: "Righteous", positionX: 23, positionY: 36 },
  { id: 2, name: "Verdant Valley Sect", description: "Righteous cultivators of the valley, masters of healing and herb lore.", path: "Righteous", positionX: 80, positionY: 75 },
  { id: 3, name: "Azure Sky Pavilion", description: "Righteous sect of the high peaks, focused on qi refinement and meditation.", path: "Righteous", positionX: 72, positionY: 16 },
  { id: 4, name: "Crimson Demon Sect", description: "Demonic sect that prizes strength and conquest above all.", path: "Demonic", positionX: 20, positionY: 65 },
  { id: 5, name: "Shadow Serpent Hall", description: "Demonic sect of assassins and poison masters.", path: "Demonic", positionX: 20, positionY: 85 },
  { id: 6, name: "Bone Abyss Sect", description: "Demonic sect that delves into forbidden arts and undead cultivation.", path: "Demonic", positionX: 77, positionY: 46 },
];
