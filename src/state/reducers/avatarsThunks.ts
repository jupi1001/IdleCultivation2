/**
 * Thunks for avatars: startExpedition/clearExpedition for "main" also set currentActivity.
 */
import type { AppDispatch } from "../store";
import { avatarsSlice } from "./avatarsSlice";
import { characterCoreSlice } from "./characterCoreSlice";

export function startExpedition(
  payload:
    | { endTime: number; missionId: number; entityType: "main" }
    | { endTime: number; missionId: number; entityType: "avatar"; avatarId: number }
) {
  return (dispatch: AppDispatch) => {
    dispatch(avatarsSlice.actions.startExpedition(payload));
    if (payload.entityType === "main") {
      dispatch(characterCoreSlice.actions.setCurrentActivity("expedition"));
    }
  };
}

export function clearExpedition(
  payload: { entityType: "main" } | { entityType: "avatar"; avatarId: number }
) {
  return (dispatch: AppDispatch) => {
    dispatch(avatarsSlice.actions.clearExpedition(payload));
    if (payload.entityType === "main") {
      dispatch(characterCoreSlice.actions.setCurrentActivity("none"));
    }
  };
}
