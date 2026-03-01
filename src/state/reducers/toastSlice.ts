import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "rareDrop" | "levelUp" | "expedition";

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
  /** When the toast was created (ms); used for 10s auto-dismiss and progress bar. */
  createdAt: number;
}

interface ToastState {
  toasts: ToastI[];
}

const TOAST_AUTO_DISMISS_MS = 10_000;

const initialState: ToastState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<ToastI, "id" | "createdAt">>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      state.toasts.push({
        ...action.payload,
        id,
        createdAt: Date.now(),
      });
    },
    dismissToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, dismissToast } = toastSlice.actions;
export { TOAST_AUTO_DISMISS_MS };
export default toastSlice.reducer;
