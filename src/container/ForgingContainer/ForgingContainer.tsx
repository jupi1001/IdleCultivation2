import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, consumeItems, addForgingXP, recordItemCrafted } from "../../state/reducers/characterSlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  REFINE_RECIPES,
  CRAFT_RECIPES,
  getForgingLevelInfo,
  getForgingTierIndex,
  getForgingXPRefine,
  getForgingXPCraft,
  FORGE_BAR_ITEMS,
  FORGING_TIER_ORDER,
  type RefineRecipeI,
  type CraftRecipeI,
} from "../../constants/forging";
import { RING_AMULET_RECIPES, type RingAmuletRecipeI } from "../../constants/ringsAmulets";
import { GEM_ITEMS } from "../../constants/gems";
import { ITEMS_BY_ID } from "../../constants/data";
import { countItem } from "../../utils/inventory";
import {
  getOwnedCraftingSetPieceIds,
  getCraftingSetForgingSavingsPercent,
  getCraftingSetForgingXpPercent,
  selectItems,
  selectForgingXP,
} from "../../state/selectors/characterSelectors";
import {
  getCraftingSetItemById,
  getCraftingSetPieceIds,
  getTierForForgingTierIndex,
  CRAFTING_SET_DROP_CHANCE_PERCENT,
} from "../../constants/craftingSets";
import { rollOneTimeDrop } from "../../utils/oneTimeDrops";
import "./ForgingContainer.css";

function getItemName(itemId: number): string {
  return ITEMS_BY_ID[itemId]?.name ?? `Item ${itemId}`;
}

function canRefine(items: { id: number; quantity?: number }[], recipe: RefineRecipeI): boolean {
  return countItem(items, recipe.ore.itemId) >= recipe.ore.amount;
}

function canCraft(items: { id: number; quantity?: number }[], recipe: CraftRecipeI): boolean {
  for (const { itemId, amount } of recipe.bars) {
    if (countItem(items, itemId) < amount) return false;
  }
  return true;
}

function canCraftRingAmulet(items: { id: number; quantity?: number }[], recipe: RingAmuletRecipeI): boolean {
  for (const { itemId, amount } of recipe.bars) {
    if (countItem(items, itemId) < amount) return false;
  }
  if (recipe.gems) {
    for (const { itemId, amount } of recipe.gems) {
      if (countItem(items, itemId) < amount) return false;
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
  const items = useSelector(selectItems);
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
      if (!canRefine(items, recipe)) return;
      const amount = recipe.ore.amount;
      const consumeAmount = Math.max(1, amount - Math.floor((amount * forgingSavings) / 100));
      dispatch(consumeItems([{ itemId: recipe.ore.itemId, amount: consumeAmount }]));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
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
        dispatch(addItem({ ...drop, quantity: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, items, forgingSavings, setXpBonus]
  );

  const doCraft = useCallback(
    (recipe: CraftRecipeI) => {
      if (!canCraft(items, recipe)) return;
      const toConsume = recipe.bars.map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      dispatch(consumeItems(toConsume));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
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
        dispatch(addItem({ ...drop, quantity: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, items, forgingSavings, setXpBonus]
  );

  const doCraftRingAmulet = useCallback(
    (recipe: RingAmuletRecipeI) => {
      if (!canCraftRingAmulet(items, recipe)) return;
      const barConsume = recipe.bars.map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      const gemConsume = (recipe.gems ?? []).map(({ itemId, amount }) => ({
        itemId,
        amount: Math.max(1, amount - Math.floor((amount * forgingSavings) / 100)),
      }));
      dispatch(consumeItems([...barConsume, ...gemConsume]));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
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
        dispatch(addItem({ ...drop, quantity: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, items, forgingSavings, setXpBonus]
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
          const canDo = canRefine(items, recipe);
          return (
            <div key={recipe.id} className="forging__recipe">
              <h4 className="forging__recipeName">{recipe.name}</h4>
              <p className="forging__recipeDesc">{recipe.description}</p>
              <div className="forging__mats">
                <span>
                  {getItemName(recipe.ore.itemId)} × {recipe.ore.amount}
                  {countItem(items, recipe.ore.itemId) < recipe.ore.amount && (
                    <span className="forging__short"> (have {countItem(items, recipe.ore.itemId)})</span>
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
                  const canDo = canCraft(items, recipe);
                  return (
                    <div key={recipe.id} className="forging__recipe">
                      <h4 className="forging__recipeName">{recipe.name}</h4>
                      <p className="forging__recipeDesc">{recipe.description}</p>
                      <div className="forging__mats">
                        {recipe.bars.map(({ itemId, amount }) => (
                          <span key={itemId}>
                            {getItemName(itemId)} × {amount}
                            {countItem(items, itemId) < amount && (
                              <span className="forging__short"> (have {countItem(items, itemId)})</span>
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
          const canDo = canCraftRingAmulet(items, recipe);
          return (
            <div key={recipe.id} className="forging__recipe">
              <h4 className="forging__recipeName">{recipe.name}</h4>
              <p className="forging__recipeDesc">{recipe.description}</p>
              <div className="forging__mats">
                {recipe.bars.map(({ itemId, amount }) => (
                  <span key={`b-${itemId}`}>
                    {getItemName(itemId)} × {amount}
                    {countItem(items, itemId) < amount && (
                      <span className="forging__short"> (have {countItem(items, itemId)})</span>
                    )}
                  </span>
                ))}
                {recipe.gems?.map(({ itemId, amount }) => (
                  <span key={`g-${itemId}`}>
                    {getItemName(itemId)} × {amount}
                    {countItem(items, itemId) < amount && (
                      <span className="forging__short"> (have {countItem(items, itemId)})</span>
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
