import { describe, expect, it } from "vitest";
import type EnemyI from "../../interfaces/EnemyI";
import type Item from "../../interfaces/ItemI";
import {
  combatSessionReducer,
  createInitialCombatSessionState,
  type CombatSessionState,
} from "./combatSession";

const dummyEnemy: EnemyI = {
  id: 1,
  name: "Test Enemy",
  attack: 1,
  defense: 1,
  health: 10,
  location: "test-area" as unknown as EnemyI["location"],
  picture: "",
};

const dummyItem: Item = {
  id: 1,
  name: "Test Item",
  price: 1,
  type: "material",
};

describe("combatSessionReducer", () => {
  const makeState = (overrides: Partial<CombatSessionState> = {}) =>
    ({
      ...createInitialCombatSessionState({ characterHealth: 20, enemy: dummyEnemy }),
      ...overrides,
    }) as CombatSessionState;

  it("applies damage to enemy and records lastDamageToEnemy", () => {
    const state = makeState();
    const next = combatSessionReducer(state, { type: "applyDamageToEnemy", damage: 3 });
    expect(next.enemy?.health).toBe(7);
    expect(next.lastDamageToEnemy).toBe(3);
  });

  it("applies damage to character and records lastDamageToCharacter", () => {
    const state = makeState({ characterHealth: 20 });
    const next = combatSessionReducer(state, { type: "applyDamageToCharacter", damage: 5 });
    expect(next.characterHealth).toBe(15);
    expect(next.lastDamageToCharacter).toBe(5);
  });

  it("heals character but not above maxHealth", () => {
    const state = makeState({ characterHealth: 18 });
    const next = combatSessionReducer(state, { type: "healCharacter", amount: 10, maxHealth: 20 });
    expect(next.characterHealth).toBe(20);
  });

  it("adds loot spirit stones cumulatively", () => {
    const state = makeState({ lootSpiritStones: 5 });
    const next = combatSessionReducer(state, { type: "addLootSpiritStones", amount: 3 });
    expect(next.lootSpiritStones).toBe(8);
  });

  it("adds and clears item bag", () => {
    const state = makeState();
    const withItem = combatSessionReducer(state, { type: "addItemToBag", item: dummyItem });
    expect(withItem.itemBag).toHaveLength(1);
    const cleared = combatSessionReducer(withItem, { type: "clearItemBag" });
    expect(cleared.itemBag).toHaveLength(0);
  });

  it("resets for new enemy and clears damage markers", () => {
    const state = makeState({ lastDamageToCharacter: 5, lastDamageToEnemy: 4 });
    const next = combatSessionReducer(state, { type: "resetForNewEnemy", enemy: dummyEnemy });
    expect(next.enemy).toBe(dummyEnemy);
    expect(next.lastDamageToCharacter).toBeNull();
    expect(next.lastDamageToEnemy).toBeNull();
  });
});

