import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "rareDrop" | "levelUp" | "expedition" | "achievement";

export interface ToastI {
  id: string;
  type: ToastType;
  /** For levelUp: skill name (e.g. "Fishing"). */
  skill?: string;
  /** For levelUp: new level number. */
  level?: number;
  /** For rareDrop: display title (e.g. "Geode" or ring name). */
  itemName?: string;
  /** For expedition: mission name. */
  expeditionName?: string;
  /** For expedition: spirit stones rewarded. */
  spiritStones?: number;
  /** For expedition: rare item name if any. */
  rareItemName?: string | null;
  /** For achievement: display name of the achievement. */
  achievementName?: string;
  /** When the toast was created (ms); used for 10s auto-dismiss and progress bar. */
  createdAt: number;
}

interface ToastState {
  toasts: ToastI[];
  /** Last N toasts for notification history (e.g. in Activity Log). */
  toastHistory: ToastI[];
}

const TOAST_AUTO_DISMISS_MS = 10_000;
const TOAST_HISTORY_MAX = 50;
const TOAST_VISIBLE_MAX = 3;

const initialState: ToastState = {
  toasts: [],
  toastHistory: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastI, "id" | "createdAt">>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const toast: ToastI = { ...action.payload, id, createdAt: Date.now() };
      state.toasts.push(toast);
      state.toastHistory.push(toast);
      if (state.toastHistory.length > TOAST_HISTORY_MAX) {
        state.toastHistory = state.toastHistory.slice(-TOAST_HISTORY_MAX);
      }
    },
    /** Add to history only (used when toast popup is disabled by settings). */
    addToastToHistory: (state, action: PayloadAction<Omit<ToastI, "id" | "createdAt">>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const toast: ToastI = { ...action.payload, id, createdAt: Date.now() };
      state.toastHistory.push(toast);
      if (state.toastHistory.length > TOAST_HISTORY_MAX) {
        state.toastHistory = state.toastHistory.slice(-TOAST_HISTORY_MAX);
      }
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, addToastToHistory, dismissToast } = toastSlice.actions;
export { TOAST_AUTO_DISMISS_MS, TOAST_HISTORY_MAX, TOAST_VISIBLE_MAX };
export default toastSlice.reducer;
