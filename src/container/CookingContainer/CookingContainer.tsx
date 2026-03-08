import React, { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  COOKING_RECIPES,
  getCookingLevelInfo,
  getCookingXP,
  type CookingRecipeI,
} from "../../constants/cooking";
import {
  getCraftingSetItemById,
  getCraftingSetPieceIds,
  getTierForCookingRecipeLevel,
  CRAFTING_SET_DROP_CHANCE_PERCENT,
} from "../../constants/craftingSets";
import { ITEMS_BY_ID } from "../../constants/data";
import { addItemById, consumeItems, addCookingXP, recordItemCrafted } from "../../state/reducers/characterSlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  getOwnedCraftingSetPieceIds,
  getCraftingSetCookingDoubleChancePercent,
  getCraftingSetCookingXpPercent,
  selectItems,
  selectCookingXP,
} from "../../state/selectors/characterSelectors";
import { countItem } from "../../utils/inventory";
import { rollOneTimeDrop } from "../../utils/oneTimeDrops";
import "./CookingContainer.css";

function getItemName(itemId: number): string {
  return ITEMS_BY_ID[itemId]?.name ?? `Item ${itemId}`;
}

function canCook(items: { id: number; quantity?: number }[], recipe: CookingRecipeI): boolean {
  for (const { itemId, amount } of recipe.ingredients) {
    if (countItem(items, itemId) < amount) return false;
  }
  return true;
}

export const CookingContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  const cookingXP = useSelector(selectCookingXP);
  const doubleChance = useSelector(getCraftingSetCookingDoubleChancePercent);
  const setXpBonus = useSelector(getCraftingSetCookingXpPercent);
  const ownedCraftingSetIds = useSelector(getOwnedCraftingSetPieceIds);
  const ownedCraftingSetRef = useRef<Set<number>>(new Set());
  ownedCraftingSetRef.current = ownedCraftingSetIds;
  const { level: cookingLevel, xpInLevel, xpRequiredForNext: xpForNext } = getCookingLevelInfo(cookingXP);

  const doCook = useCallback(
    (recipe: CookingRecipeI) => {
      if (!canCook(items, recipe)) return;
      const toConsume = recipe.ingredients.map(({ itemId, amount }) => ({ itemId, amount }));
      dispatch(consumeItems(toConsume));
      const doubleOutput = doubleChance > 0 && Math.random() * 100 < doubleChance;
      const outputQty = doubleOutput ? recipe.outputAmount * 2 : recipe.outputAmount;
      dispatch(addItemById({ itemId: recipe.output.id, amount: outputQty }));
      const xpMult = 1 + setXpBonus / 100;
      dispatch(addCookingXP(Math.max(1, Math.floor(getCookingXP(recipe.recipeLevel) * xpMult))));
      dispatch(recordItemCrafted("cooking"));

      const tier = getTierForCookingRecipeLevel(recipe.recipeLevel);
      const drop = rollOneTimeDrop(
        ownedCraftingSetRef.current,
        getCraftingSetPieceIds("cooking", tier),
        CRAFTING_SET_DROP_CHANCE_PERCENT,
        getCraftingSetItemById
      );
      if (drop) {
        dispatch(addItemById({ itemId: drop.id, amount: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, items, doubleChance, setXpBonus]
  );

  return (
    <div className="cooking">
      <h2 className="cooking__title">Cooking</h2>
      <p className="cooking__intro">
        Cook fish into food that restores vitality and can be used during combat to heal.
      </p>
      <div className="cooking__level">
        <span className="cooking__levelLabel">Cooking level: {cookingLevel}</span>
        <span className="cooking__xp">
          {xpInLevel} / {xpForNext} XP to next
        </span>
        <div className="cooking__xpBar">
          <div className="cooking__xpBarFill" style={{ width: `${(xpInLevel / xpForNext) * 100}%` }} />
        </div>
      </div>

      <h3 className="cooking__recipesTitle">Recipes</h3>
      <div className="cooking__recipes">
        {COOKING_RECIPES.map((recipe) => {
          const canDo = canCook(items, recipe);
          return (
            <div key={recipe.id} className="cooking__recipe">
              <h4 className="cooking__recipeName">{recipe.name}</h4>
              <p className="cooking__recipeDesc">{recipe.description}</p>
              <div className="cooking__mats">
                {recipe.ingredients.map(({ itemId, amount }) => (
                  <span key={itemId}>
                    {getItemName(itemId)} × {amount}
                    {countItem(items, itemId) < amount && (
                      <span className="cooking__short"> (have {countItem(items, itemId)})</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="cooking__output">→ {recipe.output.name} (restores {recipe.output.value} vitality)</p>
              <button
                type="button"
                className="cooking__btn"
                disabled={!canDo}
                onClick={() => doCook(recipe)}
                title={!canDo ? "Get the required fish first" : undefined}
              >
                Cook
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
