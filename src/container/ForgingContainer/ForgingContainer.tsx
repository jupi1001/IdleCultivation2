import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCraftingSetItemById,
  getCraftingSetPieceIds,
  getTierForForgingTierIndex,
  CRAFTING_SET_DROP_CHANCE_PERCENT,
} from "../../constants/craftingSets";
import { ITEMS_BY_ID } from "../../constants/data";
import {
  REFINE_RECIPES,
  CRAFT_RECIPES,
  getForgingLevelInfo,
  getForgingTierIndex,
  getForgingXPRefine,
  getForgingXPCraft,
  FORGING_TIER_ORDER,
  type RefineRecipeI,
  type CraftRecipeI,
} from "../../constants/forging";
import { RING_AMULET_RECIPES, type RingAmuletRecipeI } from "../../constants/ringsAmulets";
import { addItemById, consumeItems } from "../../state/reducers/inventorySlice";
import { addForgingXP } from "../../state/reducers/skillsSlice";
import { recordItemCrafted } from "../../state/reducers/statsSlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  getOwnedCraftingSetPieceIds,
  getCraftingSetForgingSavingsPercent,
  getCraftingSetForgingXpPercent,
  selectItemsById,
  selectForgingXP,
} from "../../state/selectors/characterSelectors";
import { getItemQuantity } from "../../utils/inventory";
import { rollOneTimeDrop } from "../../utils/oneTimeDrops";
import "./ForgingContainer.css";

function getItemName(itemId: number): string {
  return ITEMS_BY_ID[itemId]?.name ?? `Item ${itemId}`;
}

function canRefine(itemsById: Record<number, number>, recipe: RefineRecipeI): boolean {
  return getItemQuantity(itemsById, recipe.ore.itemId) >= recipe.ore.amount;
}

function canCraft(itemsById: Record<number, number>, recipe: CraftRecipeI): boolean {
  for (const { itemId, amount } of recipe.bars) {
    if (getItemQuantity(itemsById, itemId) < amount) return false;
  }
  return true;
}

function canCraftRingAmulet(itemsById: Record<number, number>, recipe: RingAmuletRecipeI): boolean {
  for (const { itemId, amount } of recipe.bars) {
    if (getItemQuantity(itemsById, itemId) < amount) return false;
  }
  if (recipe.gems) {
    for (const { itemId, amount } of recipe.gems) {
      if (getItemQuantity(itemsById, itemId) < amount) return false;
    }
  }
  return true;
}

/** Group recipes by tier in FORGING_TIER_ORDER; tiers with no recipes are omitted. */
function groupByTier<T extends { tier: string }>(recipes: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const tier of FORGING_TIER_ORDER) {
    const list = recipes.filter((r) => r.tier === tier);
    if (list.length > 0) map.set(tier, list);
  }
  return map;
}

export const ForgingContainer = () => {
  const dispatch = useDispatch();
  const itemsById = useSelector(selectItemsById);
  const forgingXP = useSelector(selectForgingXP);
  const forgingSavings = useSelector(getCraftingSetForgingSavingsPercent);
  const setXpBonus = useSelector(getCraftingSetForgingXpPercent);
  const ownedCraftingSetIds = useSelector(getOwnedCraftingSetPieceIds);
  const ownedCraftingSetRef = useRef<Set<number>>(new Set());
  ownedCraftingSetRef.current = ownedCraftingSetIds;
  const { level: forgingLevel, xpInLevel, xpRequiredForNext: xpForNext } = getForgingLevelInfo(forgingXP);

  /** Which tier sections are expanded. Default: all true. */
  const [tiersOpen, setTiersOpen] = useState<Record<string, boolean>>(() =>
    FORGING_TIER_ORDER.reduce((acc, t) => ({ ...acc, [t]: true }), {} as Record<string, boolean>)
  );
  const toggleTier = useCallback((tier: string) => {
    setTiersOpen((prev) => ({ ...prev, [tier]: !prev[tier] }));
  }, []);

  const craftByTier = useMemo(() => groupByTier(CRAFT_RECIPES), []);

  const doRefine = useCallback(
    (recipe: RefineRecipeI) => {
      if (!canRefine(itemsById, recipe)) return;
      const amount = recipe.ore.amount;
      const consumeAmount = Math.max(1, amount - Math.floor((amount * forgingSavings) / 100));
      dispatch(consumeItems([{ itemId: recipe.ore.itemId, amount: consumeAmount }]));
      dispatch(addItemById({ itemId: recipe.output.id, amount: recipe.outputAmount }));
      const tierIndex = getForgingTierIndex(recipe.tier);
      const xpMult = 1 + setXpBonus / 100;
      dispatch(addForgingXP(Math.max(1, Math.floor(getForgingXPRefine(tierIndex) * xpMult))));
      dispatch(recordItemCrafted("forging"));

      const setTier = getTierForForgingTierIndex(tierIndex);
      const drop = rollOneTimeDrop(
        ownedCraftingSetRef.current,
        getCraftingSetPieceIds("forging", setTier),
        CRAFTING_SET_DROP_CHANCE_PERCENT,
        getCraftingSetItemById
      );
      if (drop) {
        dispatch(addItemById({ itemId: drop.id, amount: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, itemsById, forgingSavings, setXpBonus]
  );

  const doCraft = useCallback(
    (recipe: CraftRecipeI) => {
      if (!canCraft(itemsById, recipe)) return;
      const toConsume = recipe.bars.map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      dispatch(consumeItems(toConsume));
      dispatch(addItemById({ itemId: recipe.output.id, amount: recipe.outputAmount }));
      const tierIndex = getForgingTierIndex(recipe.tier);
      const xpMult = 1 + setXpBonus / 100;
      dispatch(addForgingXP(Math.max(1, Math.floor(getForgingXPCraft(tierIndex) * xpMult))));
      dispatch(recordItemCrafted("forging"));

      const setTier = getTierForForgingTierIndex(tierIndex);
      const drop = rollOneTimeDrop(
        ownedCraftingSetRef.current,
        getCraftingSetPieceIds("forging", setTier),
        CRAFTING_SET_DROP_CHANCE_PERCENT,
        getCraftingSetItemById
      );
      if (drop) {
        dispatch(addItemById({ itemId: drop.id, amount: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, itemsById, forgingSavings, setXpBonus]
  );

  const doCraftRingAmulet = useCallback(
    (recipe: RingAmuletRecipeI) => {
      if (!canCraftRingAmulet(itemsById, recipe)) return;
      const barConsume = recipe.bars.map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      const gemConsume = (recipe.gems ?? []).map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      dispatch(consumeItems([...barConsume, ...gemConsume]));
      dispatch(addItemById({ itemId: recipe.output.id, amount: recipe.outputAmount }));
      const tierIndex = getForgingTierIndex(recipe.tier);
      const xpMult = 1 + setXpBonus / 100;
      dispatch(addForgingXP(Math.max(1, Math.floor(getForgingXPCraft(tierIndex) * xpMult))));
      dispatch(recordItemCrafted("forging"));

      const setTier = getTierForForgingTierIndex(tierIndex);
      const drop = rollOneTimeDrop(
        ownedCraftingSetRef.current,
        getCraftingSetPieceIds("forging", setTier),
        CRAFTING_SET_DROP_CHANCE_PERCENT,
        getCraftingSetItemById
      );
      if (drop) {
        dispatch(addItemById({ itemId: drop.id, amount: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, itemsById, forgingSavings, setXpBonus]
  );

  return (
    <div className="forging">
      <h2 className="forging__title">Forging</h2>
      <p className="forging__intro">
        Refine raw ore into bars, then craft weapons and armour from bars.
      </p>
      <div className="forging__level">
        <span className="forging__levelLabel">Forging level: {forgingLevel}</span>
        <span className="forging__xp">
          {xpInLevel} / {xpForNext} XP to next
        </span>
        <div className="forging__xpBar">
          <div className="forging__xpBarFill" style={{ width: `${(xpInLevel / xpForNext) * 100}%` }} />
        </div>
      </div>

      <h3 className="forging__sectionTitle">Refine ore → bars</h3>
      <p className="forging__hint">Raw ore only. Each recipe produces one bar.</p>
      <div className="forging__recipes">
        {REFINE_RECIPES.map((recipe) => {
          const canDo = canRefine(itemsById, recipe);
          return (
            <div key={recipe.id} className="forging__recipe">
              <h4 className="forging__recipeName">{recipe.name}</h4>
              <p className="forging__recipeDesc">{recipe.description}</p>
              <div className="forging__mats">
                <span>
                  {getItemName(recipe.ore.itemId)} × {recipe.ore.amount}
                  {getItemQuantity(itemsById, recipe.ore.itemId) < recipe.ore.amount && (
                    <span className="forging__short"> (have {getItemQuantity(itemsById, recipe.ore.itemId)})</span>
                  )}
                </span>
              </div>
              <p className="forging__output">→ {recipe.output.name} × {recipe.outputAmount}</p>
              <button
                type="button"
                className="forging__btn"
                disabled={!canDo}
                onClick={() => doRefine(recipe)}
                title={!canDo ? "Mine ore first" : undefined}
              >
                Refine
              </button>
            </div>
          );
        })}
      </div>

      <h3 className="forging__sectionTitle">Craft weapons & armour</h3>
      <p className="forging__hint">Bars only. Equip crafted gear in the character panel. Grouped by ore tier.</p>
      <div className="forging__tierList">
        {Array.from(craftByTier.entries()).map(([tier, recipes]) => (
          <div key={tier} className="forging__tierGroup">
            <button
              type="button"
              className="forging__tierHeader"
              onClick={() => toggleTier(tier)}
              aria-expanded={tiersOpen[tier] !== false}
            >
              <span className="forging__tierName">{tier}</span>
              <span className="forging__tierChevron" aria-hidden>
                {tiersOpen[tier] !== false ? "▼" : "▶"}
              </span>
            </button>
            {tiersOpen[tier] !== false && (
              <div className="forging__recipes">
                {recipes.map((recipe) => {
                  const canDo = canCraft(itemsById, recipe);
                  return (
                    <div key={recipe.id} className="forging__recipe">
                      <h4 className="forging__recipeName">{recipe.name}</h4>
                      <p className="forging__recipeDesc">{recipe.description}</p>
                      <div className="forging__mats">
                        {recipe.bars.map(({ itemId, amount }) => (
                          <span key={itemId}>
                            {getItemName(itemId)} × {amount}
                            {getItemQuantity(itemsById, itemId) < amount && (
                              <span className="forging__short"> (have {getItemQuantity(itemsById, itemId)})</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <p className="forging__output">→ {recipe.output.name}</p>
                      <button
                        type="button"
                        className="forging__btn"
                        disabled={!canDo}
                        onClick={() => doCraft(recipe)}
                        title={!canDo ? "Refine bars first" : undefined}
                      >
                        Craft
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="forging__sectionTitle">Rings & amulets</h3>
      <p className="forging__hint">Bars + gems. Equip in character panel. Rare rings/amulets can also drop from fishing and gathering.</p>
      <div className="forging__recipes">
        {RING_AMULET_RECIPES.map((recipe) => {
          const canDo = canCraftRingAmulet(itemsById, recipe);
          return (
            <div key={recipe.id} className="forging__recipe">
              <h4 className="forging__recipeName">{recipe.name}</h4>
              <p className="forging__recipeDesc">{recipe.description}</p>
              <div className="forging__mats">
                {recipe.bars.map(({ itemId, amount }) => (
                  <span key={`b-${itemId}`}>
                    {getItemName(itemId)} × {amount}
                    {getItemQuantity(itemsById, itemId) < amount && (
                      <span className="forging__short"> (have {getItemQuantity(itemsById, itemId)})</span>
                    )}
                  </span>
                ))}
                {recipe.gems?.map(({ itemId, amount }) => (
                  <span key={`g-${itemId}`}>
                    {getItemName(itemId)} × {amount}
                    {getItemQuantity(itemsById, itemId) < amount && (
                      <span className="forging__short"> (have {getItemQuantity(itemsById, itemId)})</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="forging__output">→ {recipe.output.name}</p>
              <button
                type="button"
                className="forging__btn"
                disabled={!canDo}
                onClick={() => doCraftRingAmulet(recipe)}
                title={!canDo ? "Get bars and gems first" : undefined}
              >
                Craft
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
