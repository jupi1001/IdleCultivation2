/**
 * Reincarnation thunk: compute preserved items from inventory + equipment, then dispatch
 * reincarnate, setItemsAfterReincarnation, and resetEquipment. Use this instead of
 * dispatching reincarnate directly so inventory/equipment are reset correctly.
 */
import type { AppDispatch, RootState } from "../store";
import { getPreservedItemsById } from "../utils/reincarnationPreservation";
import { resetEquipment } from "./equipmentSlice";
import { setItemsAfterReincarnation } from "./inventorySlice";
import { reincarnate } from "./reincarnationSlice";

export function reincarnateAndReset(payload: { karmaEarned: number; startingMoneyBonus?: number }) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const preserved = getPreservedItemsById(state.inventory.itemsById, state.equipment.equipment);
    dispatch(reincarnate(payload));
    dispatch(setItemsAfterReincarnation(preserved));
    dispatch(resetEquipment());
  };
}
