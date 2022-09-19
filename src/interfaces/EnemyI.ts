import React from "react";
import Item from "./ItemI";

interface EnemyI {
  id: number;
  name: string;
  //To display
  picture?: string;
  attack: number;
  defense: number;
  health: number;
  loot?: { items: Item[]; weight: number[] };
}

export default EnemyI;
