/**
 * Thunks that coordinate inventory + character (and equipment for skilling set checks).
 * Cast completions add loot to inventory then commit XP/clear to character.
 */
import { ITEMS_BY_ID } from "../../constants/data";
import { GEODE_ITEM } from "../../constants/gems";
import type Item from "../../interfaces/ItemI";
import type { AppDispatch, RootState } from "../store";
import { skillsSlice } from "./skillsSlice";
import { addItemById } from "./inventorySlice";

function getQuantity(itemsById: Record<number, number>, itemId: number): number {
  return itemsById[itemId] ?? 0;
}

function hasSkillingSetPiece(
  itemsById: Record<number, number>,
  equipment: RootState["equipment"]["equipment"],
  pieceId: number
): boolean {
  if (getQuantity(itemsById, pieceId) > 0) return true;
  return (["helmet", "body", "legs", "shoes"] as const).some(
    (s) => equipment[s]?.id === pieceId
  );
}

export interface CompleteFishingCastPayload {
  castId: number;
  xp: number;
  fishingLootIds: number[];
  rareDropItem?: Item | null;
  skillingSetDropItem?: Item | null;
}

export function completeFishingCast(payload: CompleteFishingCastPayload) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { itemsById } = state.inventory;
    const { equipment } = state.equipment;
    const randomId = payload.fishingLootIds[Math.floor(Math.random() * payload.fishingLootIds.length)];
    const fish = ITEMS_BY_ID[randomId];
    if (fish) dispatch(addItemById({ itemId: fish.id, amount: 1 }));
    if (payload.rareDropItem) dispatch(addItemById({ itemId: payload.rareDropItem.id, amount: 1 }));
    if (payload.skillingSetDropItem) {
      const piece = payload.skillingSetDropItem;
      if (!hasSkillingSetPiece(itemsById, equipment, piece.id)) {
        dispatch(addItemById({ itemId: piece.id, amount: 1 }));
      }
    }
    dispatch(skillsSlice.actions.completeFishingCastCommit(payload));
  };
}

export interface CompleteMiningCastPayload {
  castId: number;
  xp: number;
  miningLootId: number;
  lootQuantity?: number;
  geodeDropped?: boolean;
  skillingSetDropItem?: Item | null;
}

export function completeMiningCast(payload: CompleteMiningCastPayload) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { itemsById } = state.inventory;
    const { equipment } = state.equipment;
    const lootQty = Math.max(1, payload.lootQuantity ?? 1);
    const ore = ITEMS_BY_ID[payload.miningLootId];
    if (ore) dispatch(addItemById({ itemId: ore.id, amount: lootQty }));
    if (payload.geodeDropped) dispatch(addItemById({ itemId: GEODE_ITEM.id, amount: 1 }));
    if (payload.skillingSetDropItem) {
      const piece = payload.skillingSetDropItem;
      if (!hasSkillingSetPiece(itemsById, equipment, piece.id)) {
        dispatch(addItemById({ itemId: piece.id, amount: 1 }));
      }
    }
    dispatch(skillsSlice.actions.completeMiningCastCommit(payload));
  };
}

export interface CompleteGatheringCastPayload {
  castId: number;
  xp: number;
  gatheringLootIds: number[];
  rareDropItem?: Item | null;
  skillingSetDropItem?: Item | null;
}

export function completeGatheringCast(payload: CompleteGatheringCastPayload) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const { itemsById } = state.inventory;
    const { equipment } = state.equipment;
    const randomId = payload.gatheringLootIds[Math.floor(Math.random() * payload.gatheringLootIds.length)];
    const loot = ITEMS_BY_ID[randomId];
    if (loot) dispatch(addItemById({ itemId: loot.id, amount: 1 }));
    if (payload.rareDropItem) dispatch(addItemById({ itemId: payload.rareDropItem.id, amount: 1 }));
    if (payload.skillingSetDropItem) {
      const piece = payload.skillingSetDropItem;
      if (!hasSkillingSetPiece(itemsById, equipment, piece.id)) {
        dispatch(addItemById({ itemId: piece.id, amount: 1 }));
      }
    }
    dispatch(skillsSlice.actions.completeGatheringCastCommit(payload));
  };
}
