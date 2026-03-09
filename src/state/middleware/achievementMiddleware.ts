import type { Middleware } from "@reduxjs/toolkit";
import { ALL_ACHIEVEMENTS, ACHIEVEMENTS_BY_ID } from "../../constants/achievements";
import type { CharSnapshot } from "../../constants/achievements";
import { unlockAchievements } from "../reducers/achievementSlice";
import { addMoney } from "../reducers/characterCoreSlice";
import { addToast } from "../reducers/toastSlice";
import { selectItems } from "../selectors/characterSelectors";
import type { RootState } from "../store";

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

function buildSnapshot(state: RootState): CharSnapshot {
  const char = state.character;
  const skills = state.skills;
  const sect = state.sect;
  const reincarnation = state.reincarnation;
  const avatars = state.avatars;
  return {
    realm: char.realm,
    realmLevel: char.realmLevel,
    money: char.money,
    miner: char.miner,
    fishingXP: skills.fishingXP,
    miningXP: skills.miningXP,
    gatheringXP: skills.gatheringXP,
    alchemyXP: skills.alchemyXP,
    forgingXP: skills.forgingXP,
    cookingXP: skills.cookingXP,
    items: selectItems(state),
    equipment: state.equipment.equipment as CharSnapshot["equipment"],
    currentSectId: sect.currentSectId,
    sectRankIndex: sect.sectRankIndex,
    reincarnationCount: reincarnation.reincarnationCount,
    totalKarmaEarned: reincarnation.totalKarmaEarned,
    talentLevels: char.talentLevels,
    avatars: (avatars.avatars ?? []).map((a) => ({ id: a.id })),
    path: char.path,
  };
}

let checking = false;

export const achievementMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const actionType = (action as { type?: string }).type ?? "";

  if (!shouldCheck(actionType) || checking) return result;

  const state = store.getState();
  const unlocked: Record<string, number> = state.achievements?.unlocked ?? {};
  if (!state.character) return result;

  const snapshot = buildSnapshot(state);

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
