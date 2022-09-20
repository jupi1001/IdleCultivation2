import React from "react";
import { CombatArea } from "../enum/CombatArea";
import Item from "./ItemI";

interface EnemyI {
  id: number;
  name: string;
  //Area where to find
  location: CombatArea;
  //To display
  picture?: string;
  //stats
  attack: number;
  defense: number;
  health: number;
  //Loot
  loot?: { items: Item[]; weight: number[] };
}

export default EnemyI;
