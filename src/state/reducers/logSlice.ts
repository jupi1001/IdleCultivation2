import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** Activity log entry types for filtering. */
export type LogEntryType =
  | "combat_hit"
  | "combat_miss"
  | "enemy_killed"
  | "item_obtained"
  | "level_up"
  | "realm_breakthrough"
  | "achievement_unlocked"
  | "rare_drop";

/** Category for filter UI: combat, loot, skills, system. */
export type LogFilterCategory = "combat" | "loot" | "skills" | "system";

export interface LogEntry {
  id: string;
  type: LogEntryType;
  /** When the entry was created (ms). */
  createdAt: number;
  /** Combat: enemy name. */
  enemyName?: string;
  /** Combat: damage dealt (hit) or taken. */
  damage?: number;
  /** Loot / item: item name. */
  itemName?: string;
  /** Level up: skill name. */
  skill?: string;
  /** Level up: new level. */
  level?: number;
  /** Realm breakthrough: new realm label (e.g. "Qi Condensation 1"). */
  realm?: string;
  /** Achievement: achievement name. */
  achievementName?: string;
  /** Rare drop: item name (same as itemName but for rare_drop type). */
  rareItemName?: string;
}

const MAX_LOG_ENTRIES = 100;

function createEntryId(): string {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface LogState {
  entries: LogEntry[];
  /** UI filter: which category to show; "all" = show all. */
  filter: LogFilterCategory | "all";
  /** Whether the bottom log panel is collapsed. */
  panelCollapsed: boolean;
}

const initialState: LogState = {
  entries: [],
  filter: "all",
  panelCollapsed: true,
};

function appendEntry(state: LogState, entry: Omit<LogEntry, "id" | "createdAt">): void {
  const full: LogEntry = {
    ...entry,
    id: createEntryId(),
    createdAt: Date.now(),
  };
  state.entries.push(full);
  if (state.entries.length > MAX_LOG_ENTRIES) {
    state.entries = state.entries.slice(-MAX_LOG_ENTRIES);
  }
}

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {
    addLogEntry: (state, action: PayloadAction<Omit<LogEntry, "id" | "createdAt">>) => {
      appendEntry(state, action.payload);
    },
    setLogFilter: (state, action: PayloadAction<LogState["filter"]>) => {
      state.filter = action.payload;
    },
    setLogPanelCollapsed: (state, action: PayloadAction<boolean>) => {
      state.panelCollapsed = action.payload;
    },
    clearLog: (state) => {
      state.entries = [];
    },
  },
});

export const { addLogEntry, setLogFilter, setLogPanelCollapsed, clearLog } = logSlice.actions;
export default logSlice.reducer;

/** Map entry type to filter category for UI. */
export function getLogEntryCategory(type: LogEntryType): LogFilterCategory {
  switch (type) {
    case "combat_hit":
    case "combat_miss":
    case "enemy_killed":
      return "combat";
    case "item_obtained":
    case "rare_drop":
      return "loot";
    case "level_up":
    case "realm_breakthrough":
      return "skills";
    case "achievement_unlocked":
      return "system";
    default:
      return "system";
  }
}
