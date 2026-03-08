import type { Middleware } from "@reduxjs/toolkit";
import { addToast, addToastToHistory } from "../reducers/toastSlice";
import type { ToastType } from "../reducers/toastSlice";
import type { RootState } from "../store";

function shouldShowToast(state: RootState, type: ToastType): boolean {
  const prefs = state.character?.notificationPrefs;
  if (!prefs) return true;
  if (!prefs.toastsEnabled) return false;
  switch (type) {
    case "levelUp":
      return !!prefs.levelUp;
    case "rareDrop":
      return !!prefs.rareDrop;
    case "achievement":
      return !!prefs.achievement;
    case "expedition":
      return !!prefs.expedition;
    default:
      return true;
  }
}

/** When addToast is dispatched, show only if notification prefs allow; always add to history. */
export const toastNotificationPrefsMiddleware: Middleware = (store) => (next) => (action) => {
  if (addToast.match(action)) {
    const state = store.getState();
    const payload = action.payload;
    const show = shouldShowToast(state, payload.type);
    if (!show) {
      store.dispatch(addToastToHistory(payload));
      return;
    }
  }
  return next(action);
};
