import type { Middleware } from "@reduxjs/toolkit";
import { getAlchemyLevelInfo } from "../../constants/alchemy";
import { getCookingLevelInfo } from "../../constants/cooking";
import { getFishingLevelInfo } from "../../constants/fishingLevel";
import { getForgingLevelInfo } from "../../constants/forging";
import { getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getMiningLevelInfo } from "../../constants/miningLevel";
import {
  completeFishingCast,
  completeMiningCast,
  completeGatheringCast,
  addCookingXP,
  addAlchemyXP,
  addForgingXP,
} from "../reducers/characterSlice";
import { addToast } from "../reducers/toastSlice";

const SKILL_LABELS: Record<string, string> = {
  fishing: "Fishing",
  mining: "Mining",
  gathering: "Gathering",
  cooking: "Cooking",
  alchemy: "Alchemy",
  forging: "Forging",
};

export const toastLevelUpMiddleware: Middleware = (store) => (next) => (action) => {
  const stateBefore = store.getState();
  next(action);
  const stateAfter = store.getState();
  const charBefore = stateBefore.character;
  const charAfter = stateAfter.character;

  if (completeFishingCast.match(action)) {
    if (charAfter.fishingXP > charBefore.fishingXP) {
      const levelAfter = getFishingLevelInfo(charAfter.fishingXP).level;
      const levelBefore = getFishingLevelInfo(charBefore.fishingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.fishing, level: levelAfter }));
      }
    }
    return;
  }

  if (completeMiningCast.match(action)) {
    if (charAfter.miningXP > charBefore.miningXP) {
      const levelAfter = getMiningLevelInfo(charAfter.miningXP).level;
      const levelBefore = getMiningLevelInfo(charBefore.miningXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.mining, level: levelAfter }));
      }
    }
    return;
  }

  if (completeGatheringCast.match(action)) {
    if (charAfter.gatheringXP > charBefore.gatheringXP) {
      const levelAfter = getGatheringLevelInfo(charAfter.gatheringXP).level;
      const levelBefore = getGatheringLevelInfo(charBefore.gatheringXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.gathering, level: levelAfter }));
      }
    }
    return;
  }

  if (addCookingXP.match(action)) {
    if (charAfter.cookingXP > charBefore.cookingXP) {
      const levelAfter = getCookingLevelInfo(charAfter.cookingXP).level;
      const levelBefore = getCookingLevelInfo(charBefore.cookingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.cooking, level: levelAfter }));
      }
    }
    return;
  }

  if (addAlchemyXP.match(action)) {
    if (charAfter.alchemyXP > charBefore.alchemyXP) {
      const levelAfter = getAlchemyLevelInfo(charAfter.alchemyXP).level;
      const levelBefore = getAlchemyLevelInfo(charBefore.alchemyXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.alchemy, level: levelAfter }));
      }
    }
    return;
  }

  if (addForgingXP.match(action)) {
    if (charAfter.forgingXP > charBefore.forgingXP) {
      const levelAfter = getForgingLevelInfo(charAfter.forgingXP).level;
      const levelBefore = getForgingLevelInfo(charBefore.forgingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.forging, level: levelAfter }));
      }
    }
  }
};
