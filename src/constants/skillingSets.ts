/**
 * Re-exports for backward compatibility. Prefer importing from skillSets.
 */
export type { SkillSetName, SkillSetTier, SkillSetItem as SkillingSetItem } from "./skillSets";
export {
  SET_IDS as SKILLING_SET_IDS,
  PER_PIECE_BONUS_PERCENT,
  FULL_SET_SPEED_BONUS_PERCENT as FULL_SET_BONUS_PERCENT,
  GATHERING_SET_ITEMS as SKILLING_SET_ITEMS,
  getSetItemById as getSkillingSetItemById,
  getSetPieceIds,
  SET_DROP_CHANCE_PERCENT as SKILLING_SET_DROP_CHANCE_PERCENT,
  getTierForFishingAreaIndex,
  getTierForMiningAreaIndex,
  getTierForGatheringAreaIndex,
  ALL_GATHERING_SET_ITEM_IDS as ALL_SKILLING_SET_ITEM_IDS,
} from "./skillSets";
