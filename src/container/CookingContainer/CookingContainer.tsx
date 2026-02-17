import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addItem, consumeItems, addCookingXP } from "../../state/reducers/characterSlice";
import {
  COOKING_RECIPES,
  getCookingLevel,
  type CookingRecipeI,
} from "../../constants/cooking";
import { fishTypes } from "../../constants/data";
import "./CookingContainer.css";

function countItem(items: { id: number; quantity?: number }[], itemId: number): number {
  const entry = items.find((i) => i.id === itemId);
  return entry ? (entry.quantity ?? 1) : 0;
}

function getItemName(itemId: number, allItems: { id: number; name: string }[]): string {
  return allItems.find((i) => i.id === itemId)?.name ?? `Item ${itemId}`;
}

function canCook(items: { id: number; quantity?: number }[], recipe: CookingRecipeI): boolean {
  for (const { itemId, amount } of recipe.ingredients) {
    if (countItem(items, itemId) < amount) return false;
  }
  return true;
}

export const CookingContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.character.items);
  const cookingXP = useSelector((state: RootState) => state.character.cookingXP);
  const cookingLevel = getCookingLevel(cookingXP);
  const xpInLevel = cookingXP % 100;
  const xpForNext = 100;

  const allItemNames = useMemo(
    () => fishTypes.map((i) => ({ id: i.id, name: i.name })),
    []
  );

  const doCook = useCallback(
    (recipe: CookingRecipeI) => {
      if (!canCook(items, recipe)) return;
      const toConsume = recipe.ingredients.map(({ itemId, amount }) => ({ itemId, amount }));
      dispatch(consumeItems(toConsume));
      dispatch(addItem({ ...recipe.output, quantity: recipe.outputAmount }));
      dispatch(addCookingXP(10));
    },
    [dispatch, items]
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
                    {getItemName(itemId, allItemNames)} × {amount}
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
