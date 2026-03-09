import type EnemyI from "../../interfaces/EnemyI";
import type Item from "../../interfaces/ItemI";

export interface CombatSessionState {
  characterHealth: number;
  enemy: EnemyI | null;
  lootSpiritStones: number;
  itemBag: Item[];
  lastDamageToEnemy: number | null;
  lastDamageToCharacter: number | null;
}

export type CombatSessionAction =
  | { type: "setEnemy"; enemy: EnemyI | null }
  | { type: "setCharacterHealth"; health: number }
  | { type: "applyDamageToEnemy"; damage: number }
  | { type: "applyDamageToCharacter"; damage: number }
  | { type: "healCharacter"; amount: number; maxHealth: number }
  | { type: "setLastDamageToEnemy"; value: number | null }
  | { type: "setLastDamageToCharacter"; value: number | null }
  | { type: "addLootSpiritStones"; amount: number }
  | { type: "resetLootSpiritStones" }
  | { type: "addItemToBag"; item: Item }
  | { type: "clearItemBag" }
  | { type: "resetForNewEnemy"; enemy: EnemyI | null };

export function createInitialCombatSessionState(params: {
  characterHealth: number;
  enemy: EnemyI | null;
}): CombatSessionState {
  return {
    characterHealth: params.characterHealth,
    enemy: params.enemy,
    lootSpiritStones: 0,
    itemBag: [],
    lastDamageToEnemy: null,
    lastDamageToCharacter: null,
  };
}

export function combatSessionReducer(
  state: CombatSessionState,
  action: CombatSessionAction
): CombatSessionState {
  switch (action.type) {
    case "setEnemy":
      return { ...state, enemy: action.enemy };
    case "setCharacterHealth":
      return { ...state, characterHealth: action.health };
    case "applyDamageToEnemy": {
      const enemy = state.enemy;
      if (!enemy) return state;
      const newHealth = enemy.health - action.damage;
      return {
        ...state,
        enemy: { ...enemy, health: newHealth },
        lastDamageToEnemy: action.damage,
      };
    }
    case "applyDamageToCharacter": {
      const newHealth = state.characterHealth - action.damage;
      return {
        ...state,
        characterHealth: newHealth,
        lastDamageToCharacter: action.damage,
      };
    }
    case "healCharacter": {
      const healed = Math.min(state.characterHealth + action.amount, action.maxHealth);
      return { ...state, characterHealth: healed };
    }
    case "setLastDamageToEnemy":
      return { ...state, lastDamageToEnemy: action.value };
    case "setLastDamageToCharacter":
      return { ...state, lastDamageToCharacter: action.value };
    case "addLootSpiritStones":
      return { ...state, lootSpiritStones: state.lootSpiritStones + action.amount };
    case "resetLootSpiritStones":
      return { ...state, lootSpiritStones: 0 };
    case "addItemToBag":
      return { ...state, itemBag: [...state.itemBag, action.item] };
    case "clearItemBag":
      return { ...state, itemBag: [] };
    case "resetForNewEnemy":
      return {
        ...state,
        enemy: action.enemy,
        lastDamageToEnemy: null,
        lastDamageToCharacter: null,
      };
    default:
      return state;
  }
}

