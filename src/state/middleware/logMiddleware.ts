import type { Middleware } from "@reduxjs/toolkit";
import { formatRealm } from "../../constants/realmProgression";
import { breakthrough } from "../reducers/characterCoreSlice";
import { addLogEntry } from "../reducers/logSlice";
import { addToast } from "../reducers/toastSlice";

/**
 * Listens for actions that should create activity log entries and dispatches addLogEntry.
 * - character/breakthrough → realm_breakthrough
 * - toast addToast levelUp → level_up
 * - toast addToast achievement → achievement_unlocked
 * - toast addToast rareDrop → rare_drop
 */
export const logMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  if (breakthrough.match(action)) {
    const state = store.getState();
    const { realm, realmLevel } = state.character;
    store.dispatch(
      addLogEntry({
        type: "realm_breakthrough",
        realm: formatRealm(realm, realmLevel),
      })
    );
    return result;
  }

  if (addToast.match(action)) {
    const payload = action.payload as { type: string; skill?: string; level?: number; achievementName?: string; itemName?: string };
    switch (payload.type) {
      case "levelUp":
        store.dispatch(
          addLogEntry({
            type: "level_up",
            skill: payload.skill,
            level: payload.level,
          })
        );
        break;
      case "achievement":
        store.dispatch(
          addLogEntry({
            type: "achievement_unlocked",
            achievementName: payload.achievementName,
          })
        );
        break;
      case "rareDrop":
        store.dispatch(
          addLogEntry({
            type: "rare_drop",
            itemName: payload.itemName,
            rareItemName: payload.itemName,
          })
        );
        break;
      default:
        break;
    }
  }

  return result;
};
