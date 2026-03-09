/**
 * Focused selectors for achievements, log, and toast slices.
 * Use these instead of inline (state) => state.achievements?.unlocked in components.
 */
import type { RootState } from "../store";

/** Unlocked achievements: achievement id -> unlock timestamp. */
export const selectUnlockedAchievements = (state: RootState): Record<string, number> =>
  state.achievements?.unlocked ?? {};

/** Log entries (activity feed). */
export const selectLogEntries = (state: RootState) => state.log?.entries ?? [];

/** Current log filter category. */
export const selectLogFilter = (state: RootState) => state.log?.filter ?? "all";

/** Whether the log panel is collapsed (when rendered as panel). */
export const selectLogPanelCollapsed = (state: RootState) => state.log?.panelCollapsed ?? true;

/** Active toasts (visible notifications). */
export const selectToasts = (state: RootState) => state.toast.toasts;

/** Toast history (for Log "Notifications" view). */
export const selectToastHistory = (state: RootState) => state.toast?.toastHistory ?? [];
