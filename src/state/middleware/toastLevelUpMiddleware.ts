import type { Middleware } from "@reduxjs/toolkit";
import { getAlchemyLevelInfo } from "../../constants/alchemy";
import { getCookingLevelInfo } from "../../constants/cooking";
import { getFishingLevelInfo } from "../../constants/fishingLevel";
import { getForgingLevelInfo } from "../../constants/forging";
import { getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { getMiningLevelInfo } from "../../constants/miningLevel";
import {
  completeFishingCastCommit,
  completeMiningCastCommit,
  completeGatheringCastCommit,
  addCookingXP,
  addAlchemyXP,
  addForgingXP,
} from "../reducers/skillsSlice";
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
  const skillsBefore = stateBefore.skills;
  const skillsAfter = stateAfter.skills;

  if (completeFishingCastCommit.match(action)) {
    if (skillsAfter.fishingXP > skillsBefore.fishingXP) {
      const levelAfter = getFishingLevelInfo(skillsAfter.fishingXP).level;
      const levelBefore = getFishingLevelInfo(skillsBefore.fishingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.fishing, level: levelAfter }));
      }
    }
    return;
  }

  if (completeMiningCastCommit.match(action)) {
    if (skillsAfter.miningXP > skillsBefore.miningXP) {
      const levelAfter = getMiningLevelInfo(skillsAfter.miningXP).level;
      const levelBefore = getMiningLevelInfo(skillsBefore.miningXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.mining, level: levelAfter }));
      }
    }
    return;
  }

  if (completeGatheringCastCommit.match(action)) {
    if (skillsAfter.gatheringXP > skillsBefore.gatheringXP) {
      const levelAfter = getGatheringLevelInfo(skillsAfter.gatheringXP).level;
      const levelBefore = getGatheringLevelInfo(skillsBefore.gatheringXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.gathering, level: levelAfter }));
      }
    }
    return;
  }

  if (addCookingXP.match(action)) {
    if (skillsAfter.cookingXP > skillsBefore.cookingXP) {
      const levelAfter = getCookingLevelInfo(skillsAfter.cookingXP).level;
      const levelBefore = getCookingLevelInfo(skillsBefore.cookingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.cooking, level: levelAfter }));
      }
    }
    return;
  }

  if (addAlchemyXP.match(action)) {
    if (skillsAfter.alchemyXP > skillsBefore.alchemyXP) {
      const levelAfter = getAlchemyLevelInfo(skillsAfter.alchemyXP).level;
      const levelBefore = getAlchemyLevelInfo(skillsBefore.alchemyXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.alchemy, level: levelAfter }));
      }
    }
    return;
  }

  if (addForgingXP.match(action)) {
    if (skillsAfter.forgingXP > skillsBefore.forgingXP) {
      const levelAfter = getForgingLevelInfo(skillsAfter.forgingXP).level;
      const levelBefore = getForgingLevelInfo(skillsBefore.forgingXP).level;
      if (levelAfter > levelBefore) {
        store.dispatch(addToast({ type: "levelUp", skill: SKILL_LABELS.forging, level: levelAfter }));
      }
    }
  }
};
