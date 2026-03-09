import React, { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ALCHEMY_RECIPES,
  getAlchemyLevelInfo,
  getAlchemySuccessChance,
  getAlchemyXPSuccess,
  getAlchemyXPFail,
  type AlchemyRecipeI,
} from "../../constants/alchemy";
import {
  getCraftingSetItemById,
  getCraftingSetPieceIds,
  getTierForAlchemyRecipeLevel,
  CRAFTING_SET_DROP_CHANCE_PERCENT,
} from "../../constants/craftingSets";
import { ITEMS_BY_ID } from "../../constants/data";
import { addItemById, consumeItems } from "../../state/reducers/inventorySlice";
import { addAlchemyXP } from "../../state/reducers/skillsSlice";
import { recordItemCrafted } from "../../state/reducers/statsSlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  getTalentAlchemySuccessPercent,
  getCraftingSetAlchemySuccessPercent,
  getCraftingSetAlchemyXpPercent,
  getOwnedCraftingSetPieceIds,
  selectItemsById,
  selectAlchemyXP,
} from "../../state/selectors/characterSelectors";
import { getItemQuantity } from "../../utils/inventory";
import { rollOneTimeDrop } from "../../utils/oneTimeDrops";
import "./AlchemyContainer.css";

function getItemName(itemId: number): string {
  return ITEMS_BY_ID[itemId]?.name ?? `Item ${itemId}`;
}

function canCraft(itemsById: Record<number, number>, recipe: AlchemyRecipeI): boolean {
  for (const { itemId, amount } of recipe.ingredients) {
    if (getItemQuantity(itemsById, itemId) < amount) return false;
  }
  const { itemId, amount } = recipe.woodForFire;
  if (getItemQuantity(itemsById, itemId) < amount) return false;
  return true;
}

export const AlchemyContainer = () => {
  const dispatch = useDispatch();
  const itemsById = useSelector(selectItemsById);
  const alchemyXP = useSelector(selectAlchemyXP);
  const talentAlchemyBonus = useSelector(getTalentAlchemySuccessPercent);
  const setSuccessBonus = useSelector(getCraftingSetAlchemySuccessPercent);
  const setXpBonus = useSelector(getCraftingSetAlchemyXpPercent);
  const ownedCraftingSetIds = useSelector(getOwnedCraftingSetPieceIds);
  const ownedCraftingSetRef = useRef<Set<number>>(new Set());
  ownedCraftingSetRef.current = ownedCraftingSetIds;
  const { level: alchemyLevel, xpInLevel, xpRequiredForNext: xpForNext } = getAlchemyLevelInfo(alchemyXP);

  const attemptCraft = useCallback(
    (recipe: AlchemyRecipeI) => {
      if (!canCraft(itemsById, recipe)) return;
      const baseChance = getAlchemySuccessChance(alchemyLevel, recipe.recipeLevel);
      const chance = Math.min(100, baseChance + (talentAlchemyBonus ?? 0) + setSuccessBonus);
      const success = Math.random() * 100 < chance;

      const toConsume = [
        ...recipe.ingredients.map(({ itemId, amount }) => ({ itemId, amount })),
        { itemId: recipe.woodForFire.itemId, amount: recipe.woodForFire.amount },
      ];
      dispatch(consumeItems(toConsume));

      const xpMult = 1 + setXpBonus / 100;
      if (success) {
        dispatch(
          addItemById({ itemId: recipe.output.id, amount: recipe.outputAmount })
        );
        dispatch(addAlchemyXP(Math.max(1, Math.floor(getAlchemyXPSuccess(recipe.recipeLevel) * xpMult))));
        dispatch(recordItemCrafted("alchemy"));
      } else {
        dispatch(addAlchemyXP(Math.max(0, Math.floor(getAlchemyXPFail(recipe.recipeLevel) * xpMult))));
      }

      const tier = getTierForAlchemyRecipeLevel(recipe.recipeLevel);
      const pieceIds = getCraftingSetPieceIds("alchemy", tier);
      const drop = rollOneTimeDrop(
        ownedCraftingSetRef.current,
        pieceIds,
        CRAFTING_SET_DROP_CHANCE_PERCENT,
        getCraftingSetItemById
      );
      if (drop) {
        dispatch(addItemById({ itemId: drop.id, amount: 1 }));
        dispatch(addToast({ type: "rareDrop", itemName: drop.name }));
      }
    },
    [dispatch, itemsById, alchemyLevel, talentAlchemyBonus, setSuccessBonus, setXpBonus]
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
          const canDo = canCraft(itemsById, recipe);
          const baseChance = getAlchemySuccessChance(alchemyLevel, recipe.recipeLevel);
          const successChance = Math.min(100, baseChance + (talentAlchemyBonus ?? 0) + setSuccessBonus);
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
                      {getItemQuantity(itemsById, itemId) < amount && (
                        <span className="alchemy__matsShort"> (have {getItemQuantity(itemsById, itemId)})</span>
                      )}
                    </li>
                  ))}
                </ul>
                <span className="alchemy__matsLabel">Wood for fire:</span>
                <span className="alchemy__wood">
                  {getItemName(recipe.woodForFire.itemId)} × {recipe.woodForFire.amount}
                  {getItemQuantity(itemsById, recipe.woodForFire.itemId) < recipe.woodForFire.amount && (
                    <span className="alchemy__matsShort">
                      {" "}(have {getItemQuantity(itemsById, recipe.woodForFire.itemId)})
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
