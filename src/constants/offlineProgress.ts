/** Maximum offline time to reward (12 hours in ms). */
export const OFFLINE_PROGRESS_CAP_MS = 12 * 60 * 60 * 1000;

/** Minimum offline time to apply progress (10 seconds). Shorter gaps are ignored. */
export const OFFLINE_PROGRESS_MIN_MS = 10 * 1000;

/** localStorage key written on beforeunload for accurate last-active time. */
export const LAST_ACTIVE_STORAGE_KEY = "idle-cultivation-lastActive";
