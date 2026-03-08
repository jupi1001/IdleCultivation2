/**
 * Re-exports for backward compatibility. Prefer importing from skillSets.
 */
export type { SkillSetName as CraftingSetName, SkillSetTier as CraftingSetTier, SkillSetItem as CraftingSetItem } from "./skillSets";
export {
  SET_IDS as CRAFTING_SET_IDS,
  PER_PIECE_BONUS_PERCENT as CRAFTING_PER_PIECE_XP_BONUS,
  FULL_SET_ALCHEMY_SUCCESS_PERCENT as CRAFTING_FULL_SET_ALCHEMY_SUCCESS,
  FULL_SET_FORGING_SAVINGS_PERCENT as CRAFTING_FULL_SET_FORGING_SAVINGS,
  FULL_SET_COOKING_DOUBLE_PERCENT as CRAFTING_FULL_SET_COOKING_DOUBLE,
  CRAFTING_SET_ITEMS,
  getSetItemById as getCraftingSetItemById,
  getSetPieceIds as getCraftingSetPieceIds,
  SET_DROP_CHANCE_PERCENT as CRAFTING_SET_DROP_CHANCE_PERCENT,
  getTierForAlchemyRecipeLevel,
  getTierForForgingTierIndex,
  getTierForCookingRecipeLevel,
  ALL_CRAFTING_SET_ITEM_IDS,
} from "./skillSets";
