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
import { addItemById, consumeItems } from "../../state/reducers/inventorySlice";
import { addCookingXP } from "../../state/reducers/skillsSlice";
import { recordItemCrafted } from "../../state/reducers/statsSlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  getOwnedCraftingSetPieceIds,
  getCraftingSetCookingDoubleChancePercent,
  getCraftingSetCookingXpPercent,
  selectItemsById,
  selectCookingXP,
} from "../../state/selectors/characterSelectors";
import { getItemQuantity } from "../../utils/inventory";
import { getConsumableEffect } from "../../interfaces/ItemI";
import { rollOneTimeDrop } from "../../utils/oneTimeDrops";
import "./CookingContainer.css";

function getItemName(itemId: number): string {
  return ITEMS_BY_ID[itemId]?.name ?? `Item ${itemId}`;
}

function canCook(itemsById: Record<number, number>, recipe: CookingRecipeI): boolean {
  for (const { itemId, amount } of recipe.ingredients) {
    if (getItemQuantity(itemsById, itemId) < amount) return false;
  }
  return true;
}

export const CookingContainer = () => {
  const dispatch = useDispatch();
  const itemsById = useSelector(selectItemsById);
  const cookingXP = useSelector(selectCookingXP);
  const doubleChance = useSelector(getCraftingSetCookingDoubleChancePercent);
  const setXpBonus = useSelector(getCraftingSetCookingXpPercent);
  const ownedCraftingSetIds = useSelector(getOwnedCraftingSetPieceIds);
  const ownedCraftingSetRef = useRef<Set<number>>(new Set());
  ownedCraftingSetRef.current = ownedCraftingSetIds;
  const { level: cookingLevel, xpInLevel, xpRequiredForNext: xpForNext } = getCookingLevelInfo(cookingXP);

  const doCook = useCallback(
    (recipe: CookingRecipeI) => {
      if (!canCook(itemsById, recipe)) return;
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
    [dispatch, itemsById, doubleChance, setXpBonus]
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
          const canDo = canCook(itemsById, recipe);
          return (
            <div key={recipe.id} className="cooking__recipe">
              <h4 className="cooking__recipeName">{recipe.name}</h4>
              <p className="cooking__recipeDesc">{recipe.description}</p>
              <div className="cooking__mats">
                {recipe.ingredients.map(({ itemId, amount }) => (
                  <span key={itemId}>
                    {getItemName(itemId)} × {amount}
                    {getItemQuantity(itemsById, itemId) < amount && (
                      <span className="cooking__short"> (have {getItemQuantity(itemsById, itemId)})</span>
                    )}
                  </span>
                ))}
              </div>
              <p className="cooking__output">→ {recipe.output.name}{(() => { const eff = getConsumableEffect(recipe.output); return eff ? (eff.type === "healVitality" ? ` (restores ${eff.amount} vitality)` : eff.type === "grantQi" ? ` (restores ${eff.amount} Qi)` : "") : ""; })()}</p>
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
