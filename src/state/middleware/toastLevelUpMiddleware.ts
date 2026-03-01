import type { Middleware } from "@reduxjs/toolkit";
import { addToast } from "../reducers/toastSlice";
import {
  completeFishingCast,
  completeMiningCast,
  completeGatheringCast,
  addCookingXP,
  addAlchemyXP,
  addForgingXP,
} from "../reducers/characterSlice";
import { getFishingLevelInfo } from "../../constants/fishingLevel";
import { getMiningLevelInfo } from "../../constants/miningLevel";
import { getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getCookingLevelInfo } from "../../constants/cooking";
import { getAlchemyLevelInfo } from "../../constants/alchemy";
import { getForgingLevelInfo } from "../../constants/forging";

const SKILL_LABELS: Record<string, string> = {
  fishing: "Fishing",
  mining: "Mining",
  gathering: "Gathering",
  cooking: "Cooking",
  alchemy: "Alchemy",
  forging: "Forging",
};

export const toastLevelUpMiddleware: Middleware = (store) => (next) => (action) => {
  next(action);

  const state = store.getState();
  const char = state.character;

  if (completeFishingCast.match(action)) {
    const xpGain = action.payload.fishingXP;
    const levelBefore = getFishingLevelInfo(char.fishingXP - xpGain).level;
    const levelAfter = getFishingLevelInfo(char.fishingXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.fishing, level: levelAfter }));
    }
    return;
  }

  if (completeMiningCast.match(action)) {
    const xpGain = action.payload.miningXP;
    const levelBefore = getMiningLevelInfo(char.miningXP - xpGain).level;
    const levelAfter = getMiningLevelInfo(char.miningXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.mining, level: levelAfter }));
    }
    return;
  }

  if (completeGatheringCast.match(action)) {
    const xpGain = action.payload.gatheringXP;
    const levelBefore = getGatheringLevelInfo(char.gatheringXP - xpGain).level;
    const levelAfter = getGatheringLevelInfo(char.gatheringXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.gathering, level: levelAfter }));
    }
    return;
  }

  if (addCookingXP.match(action)) {
    const xpGain = action.payload;
    const levelBefore = getCookingLevelInfo(char.cookingXP - xpGain).level;
    const levelAfter = getCookingLevelInfo(char.cookingXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.cooking, level: levelAfter }));
    }
    return;
  }

  if (addAlchemyXP.match(action)) {
    const xpGain = action.payload;
    const levelBefore = getAlchemyLevelInfo(char.alchemyXP - xpGain).level;
    const levelAfter = getAlchemyLevelInfo(char.alchemyXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.alchemy, level: levelAfter }));
    }
    return;
  }

  if (addForgingXP.match(action)) {
    const xpGain = action.payload;
    const levelBefore = getForgingLevelInfo(char.forgingXP - xpGain).level;
    const levelAfter = getForgingLevelInfo(char.forgingXP).level;
    if (levelAfter > levelBefore) {
      store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.forging, level: levelAfter }));
    }
  }
};
