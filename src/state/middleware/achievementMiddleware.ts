import type { Middleware } from "@reduxjs/toolkit";
import { ALL_ACHIEVEMENTS, ACHIEVEMENTS_BY_ID } from "../../constants/achievements";
import type { CharSnapshot } from "../../constants/achievements";
import { unlockAchievements } from "../reducers/achievementSlice";
import { addToast } from "../reducers/toastSlice";
import { addMoney } from "../reducers/characterSlice";
import { selectItems } from "../selectors/characterSelectors";

/**
 * Middleware that checks for newly unlocked achievements after every action
 * that mutates character state. Newly unlocked achievements trigger:
 *   1. An `unlockAchievements` dispatch (persisted)
 *   2. A toast per achievement
 *   3. Spirit stone reward via `addMoney`
 */

const IGNORED_PREFIXES = ["toast/", "achievements/", "content/", "persist/"];

function shouldCheck(actionType: string): boolean {
  return !IGNORED_PREFIXES.some((p) => actionType.startsWith(p));
}

function buildSnapshot(char: Record<string, unknown>, resolvedItems: CharSnapshot["items"]): CharSnapshot {
  return {
    realm: char.realm as CharSnapshot["realm"],
    realmLevel: char.realmLevel as number,
    money: char.money as number,
    miner: char.miner as number,
    fishingXP: char.fishingXP as number,
    miningXP: char.miningXP as number,
    gatheringXP: char.gatheringXP as number,
    alchemyXP: char.alchemyXP as number,
    forgingXP: char.forgingXP as number,
    cookingXP: char.cookingXP as number,
    items: resolvedItems,
    equipment: char.equipment as CharSnapshot["equipment"],
    currentSectId: char.currentSectId as number | null,
    sectRankIndex: char.sectRankIndex as number,
    reincarnationCount: (char.reincarnationCount as number) ?? 0,
    totalKarmaEarned: (char.totalKarmaEarned as number) ?? 0,
    talentLevels: char.talentLevels as Record<number, number>,
    avatars: char.avatars as CharSnapshot["avatars"],
    path: char.path as string | null,
  };
}

let checking = false;

export const achievementMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const actionType = (action as { type?: string }).type ?? "";

  if (!shouldCheck(actionType) || checking) return result;

  const state = store.getState();
  const unlocked: Record<string, number> = state.achievements?.unlocked ?? {};
  const char = state.character;
  if (!char) return result;

  const snapshot = buildSnapshot(char, selectItems(state));

  const newlyUnlocked: string[] = [];
  for (const ach of ALL_ACHIEVEMENTS) {
    if (unlocked[ach.id]) continue;
    try {
      if (ach.check(snapshot)) {
        newlyUnlocked.push(ach.id);
      }
    } catch {
      // Gracefully ignore broken checks
    }
  }

  if (newlyUnlocked.length > 0) {
    checking = true;
    try {
      store.dispatch(unlockAchievements(newlyUnlocked));

      let totalReward = 0;
      for (const id of newlyUnlocked) {
        const ach = ACHIEVEMENTS_BY_ID[id];
        if (!ach) continue;
        store.dispatch(addToast({ type: "achievement", achievementName: ach.name }));
        if (ach.reward > 0) totalReward += ach.reward;
      }

      if (totalReward > 0) {
        store.dispatch(addMoney(totalReward));
      }
    } finally {
      checking = false;
    }
  }

  return result;
};
