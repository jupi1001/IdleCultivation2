import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addItem, consumeItems, addAlchemyXP } from "../../state/reducers/characterSlice";
import {
  ALCHEMY_RECIPES,
  getAlchemyLevelInfo,
  getAlchemySuccessChance,
  getAlchemyXPSuccess,
  getAlchemyXPFail,
  type AlchemyRecipeI,
} from "../../constants/alchemy";
import { gatheringLootTypes } from "../../constants/data";
import "./AlchemyContainer.css";

function getItemName(itemId: number): string {
  return gatheringLootTypes.find((i) => i.id === itemId)?.name ?? `Item ${itemId}`;
}

function countItem(items: { id: number; quantity?: number }[], itemId: number): number {
  const entry = items.find((i) => i.id === itemId);
  return entry ? (entry.quantity ?? 1) : 0;
}

function canCraft(items: { id: number; quantity?: number }[], recipe: AlchemyRecipeI): boolean {
  for (const { itemId, amount } of recipe.ingredients) {
    if (countItem(items, itemId) < amount) return false;
  }
  const { itemId, amount } = recipe.woodForFire;
  if (countItem(items, itemId) < amount) return false;
  return true;
}

export const AlchemyContainer = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.character.items);
  const alchemyXP = useSelector((state: RootState) => state.character.alchemyXP);
  const { level: alchemyLevel, xpInLevel, xpRequiredForNext: xpForNext } = getAlchemyLevelInfo(alchemyXP);

  const attemptCraft = useCallback(
    (recipe: AlchemyRecipeI) => {
      if (!canCraft(items, recipe)) return;
      const chance = getAlchemySuccessChance(alchemyLevel, recipe.recipeLevel);
      const success = Math.random() * 100 < chance;

      const toConsume = [
        ...recipe.ingredients.map(({ itemId, amount }) => ({ itemId, amount })),
        { itemId: recipe.woodForFire.itemId, amount: recipe.woodForFire.amount },
      ];
      dispatch(consumeItems(toConsume));

      if (success) {
        dispatch(
          addItem({
            ...recipe.output,
            quantity: recipe.outputAmount,
          })
        );
        dispatch(addAlchemyXP(getAlchemyXPSuccess(recipe.recipeLevel)));
      } else {
        dispatch(addAlchemyXP(getAlchemyXPFail(recipe.recipeLevel)));
      }
    },
    [dispatch, items, alchemyLevel]
  );

  return (
    <div className="alchemy">
      <h2 className="alchemy__title">Alchemy</h2>
      <p className="alchemy__intro">
        Consume herbs and wood (to light the fire) to craft pills. Higher alchemy level reduces the chance to fail.
      </p>
      <div className="alchemy__level">
        <span className="alchemy__levelLabel">Alchemy level: {alchemyLevel}</span>
        <span className="alchemy__xp">
          {xpInLevel} / {xpForNext} XP to next
        </span>
        <div className="alchemy__xpBar">
          <div className="alchemy__xpBarFill" style={{ width: `${(xpInLevel / xpForNext) * 100}%` }} />
        </div>
      </div>

      <h3 className="alchemy__recipesTitle">Recipes</h3>
      <div className="alchemy__recipes">
        {ALCHEMY_RECIPES.map((recipe) => {
          const canDo = canCraft(items, recipe);
          const successChance = getAlchemySuccessChance(alchemyLevel, recipe.recipeLevel);
          return (
            <div key={recipe.id} className="alchemy__recipe">
              <h4 className="alchemy__recipeName">{recipe.name}</h4>
              <p className="alchemy__recipeDesc">{recipe.description}</p>
              <p className="alchemy__recipeLevel">Recipe level: {recipe.recipeLevel}</p>
              <div className="alchemy__mats">
                <span className="alchemy__matsLabel">Ingredients:</span>
                <ul className="alchemy__matsList">
                  {recipe.ingredients.map(({ itemId, amount }) => (
                    <li key={itemId}>
                      {getItemName(itemId)} × {amount}
                      {countItem(items, itemId) < amount && (
                        <span className="alchemy__matsShort"> (have {countItem(items, itemId)})</span>
                      )}
                    </li>
                  ))}
                </ul>
                <span className="alchemy__matsLabel">Wood for fire:</span>
                <span className="alchemy__wood">
                  {getItemName(recipe.woodForFire.itemId)} × {recipe.woodForFire.amount}
                  {countItem(items, recipe.woodForFire.itemId) < recipe.woodForFire.amount && (
                    <span className="alchemy__matsShort">
                      {" "}(have {countItem(items, recipe.woodForFire.itemId)})
                    </span>
                  )}
                </span>
              </div>
              <p className="alchemy__success">
                Success chance: <strong>{Math.round(successChance)}%</strong>
                {recipe.recipeLevel > alchemyLevel && (
                  <span className="alchemy__successNote"> (recipe above your level)</span>
                )}
              </p>
              <p className="alchemy__output">Output: {recipe.output.name} × {recipe.outputAmount}</p>
              <button
                type="button"
                className="alchemy__attempt"
                disabled={!canDo}
                onClick={() => attemptCraft(recipe)}
                title={!canDo ? "Gather herbs and wood first" : undefined}
              >
                Attempt craft
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
