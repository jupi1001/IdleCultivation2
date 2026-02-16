import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addItem, consumeItems, addForgingXP } from "../../state/reducers/characterSlice";
import {
  REFINE_RECIPES,
  CRAFT_RECIPES,
  getForgingLevel,
  FORGE_BAR_ITEMS,
  type RefineRecipeI,
  type CraftRecipeI,
} from "../../constants/forging";
import { oreTypes } from "../../constants/data";
import "./ForgingContainer.css";

function countItem(items: { id: number; quantity?: number }[], itemId: number): number {
  const entry = items.find((i) => i.id === itemId);
  return entry ? (entry.quantity ?? 1) : 0;
}

function getItemName(
  itemId: number,
  allItems: { id: number; name: string }[]
): string {
  return allItems.find((i) => i.id === itemId)?.name ?? `Item ${itemId}`;
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

export const ForgingContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.character.items);
  const forgingXP = useSelector((state: RootState) => state.character.forgingXP);
  const forgingLevel = getForgingLevel(forgingXP);
  const xpInLevel = forgingXP % 100;
  const xpForNext = 100;

  const allItemNames = useMemo(
    () => [
      ...oreTypes.map((i) => ({ id: i.id, name: i.name })),
      ...FORGE_BAR_ITEMS.map((i) => ({ id: i.id, name: i.name })),
      ...CRAFT_RECIPES.map((r) => ({ id: r.output.id, name: r.output.name })),
    ],
    []
  );

  const doRefine = useCallback(
    (recipe: RefineRecipeI) => {
      if (!canRefine(items, recipe)) return;
      dispatch(consumeItems([{ itemId: recipe.ore.itemId, amount: recipe.ore.amount }]));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
      dispatch(addForgingXP(10));
    },
    [dispatch, items]
  );

  const doCraft = useCallback(
    (recipe: CraftRecipeI) => {
      if (!canCraft(items, recipe)) return;
      const toConsume = recipe.bars.map(({ itemId, amount }) => ({ itemId, amount }));
      dispatch(consumeItems(toConsume));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
      dispatch(addForgingXP(15));
    },
    [dispatch, items]
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
                  {getItemName(recipe.ore.itemId, allItemNames)} × {recipe.ore.amount}
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
      <p className="forging__hint">Bars only. Equip crafted gear in the character panel.</p>
      <div className="forging__recipes">
        {CRAFT_RECIPES.map((recipe) => {
          const canDo = canCraft(items, recipe);
          return (
            <div key={recipe.id} className="forging__recipe">
              <h4 className="forging__recipeName">{recipe.name}</h4>
              <p className="forging__recipeDesc">{recipe.description}</p>
              <div className="forging__mats">
                {recipe.bars.map(({ itemId, amount }) => (
                  <span key={itemId}>
                    {getItemName(itemId, allItemNames)} × {amount}
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
    </div>
  );
};
