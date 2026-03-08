import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type LogEntry,
  type LogFilterCategory,
  getLogEntryCategory,
  setLogFilter,
  setLogPanelCollapsed,
  clearLog,
} from "../../state/reducers/logSlice";
import type { ToastI } from "../../state/reducers/toastSlice";
import { RootState } from "../../state/store";
import "./LogContainer.css";

const FILTER_OPTIONS: { value: LogFilterCategory | "all" | "notifications"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "combat", label: "Combat" },
  { value: "loot", label: "Loot" },
  { value: "skills", label: "Skills" },
  { value: "system", label: "System" },
  { value: "notifications", label: "Notifications" },
];

function formatTime(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatEntryText(entry: LogEntry): string {
  switch (entry.type) {
    case "combat_hit":
      return entry.enemyName != null
        ? `Hit ${entry.enemyName} for ${entry.damage ?? 0} damage`
        : `Hit for ${entry.damage ?? 0} damage`;
    case "combat_miss":
      return entry.enemyName != null ? `Missed ${entry.enemyName}` : "Missed";
    case "enemy_killed":
      return entry.enemyName != null ? `Killed ${entry.enemyName}` : "Enemy killed";
    case "item_obtained":
      return entry.itemName != null ? `Obtained: ${entry.itemName}` : "Item obtained";
    case "level_up":
      return entry.skill != null && entry.level != null
        ? `${entry.skill} level ${entry.level}`
        : "Level up";
    case "realm_breakthrough":
      return entry.realm != null ? `Breakthrough: ${entry.realm}` : "Realm breakthrough";
    case "achievement_unlocked":
      return entry.achievementName != null ? `Achievement: ${entry.achievementName}` : "Achievement unlocked";
    case "rare_drop":
      return entry.itemName != null || entry.rareItemName != null
        ? `Rare drop: ${entry.itemName ?? entry.rareItemName}`
        : "Rare drop";
    default:
      return "—";
  }
}

function entryTypeIcon(type: LogEntry["type"]): string {
  switch (type) {
    case "combat_hit":
      return "⚔";
    case "combat_miss":
      return "↷";
    case "enemy_killed":
      return "☠";
    case "item_obtained":
      return "📦";
    case "level_up":
      return "⬆";
    case "realm_breakthrough":
      return "✨";
    case "achievement_unlocked":
      return "🏆";
    case "rare_drop":
      return "💎";
    default:
      return "•";
  }
}

interface LogContainerProps {
  /** When true, render as collapsible bottom panel; when false, full page. */
  asPanel?: boolean;
}

export const LogContainer: React.FC<LogContainerProps> = ({ asPanel = false }) => {
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.log?.entries ?? []);
  const filter = useSelector((state: RootState) => state.log?.filter ?? "all");
  const panelCollapsed = useSelector((state: RootState) => state.log?.panelCollapsed ?? true);
  const toastHistory = useSelector((state: RootState) => state.toast?.toastHistory ?? []);

  const filteredEntries = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "notifications") return [];
    return entries.filter((e) => getLogEntryCategory(e.type) === filter);
  }, [entries, filter]);

  const visibleEntries = useMemo(() => [...filteredEntries].reverse(), [filteredEntries]);
  const visibleNotifications = useMemo(() => [...toastHistory].reverse(), [toastHistory]);

  function formatNotificationText(t: ToastI): string {
    switch (t.type) {
      case "levelUp":
        return `${t.skill ?? "Skill"} level ${t.level ?? 0}`;
      case "rareDrop":
        return `Rare: ${t.itemName ?? "Item"}`;
      case "achievement":
        return `Achievement: ${t.achievementName ?? ""}`;
      case "expedition":
        return `${t.expeditionName ?? "Expedition"} — +${t.spiritStones ?? 0} SS${t.rareItemName ? `, ${t.rareItemName}` : ""}`;
      default:
        return String(t.type);
    }
  }

  const handleClear = () => {
    dispatch(clearLog());
  };

  const togglePanel = () => {
    dispatch(setLogPanelCollapsed(!panelCollapsed));
  };

  const content = (
    <>
      <div className="activity-log__toolbar">
        <div className="activity-log__filters">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`activity-log__filter-btn ${filter === opt.value ? "activity-log__filter-btn--active" : ""}`}
              onClick={() => dispatch(setLogFilter(opt.value))}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" className="activity-log__clear" onClick={handleClear} title="Clear log">
          Clear
        </button>
      </div>
      <ul className="activity-log__list" aria-label="Activity log entries">
        {filter === "notifications" ? (
          visibleNotifications.length === 0 ? (
            <li className="activity-log__empty">No notifications yet. Level-ups, rare drops, and achievements will appear here.</li>
          ) : (
            visibleNotifications.map((t) => (
              <li key={t.id} className="activity-log__entry activity-log__entry--system">
                <span className="activity-log__entry-icon" aria-hidden>🔔</span>
                <span className="activity-log__entry-time">{formatTime(t.createdAt)}</span>
                <span className="activity-log__entry-text">{formatNotificationText(t)}</span>
              </li>
            ))
          )
        ) : visibleEntries.length === 0 ? (
          <li className="activity-log__empty">No entries yet. Combat, loot, level-ups, and breakthroughs will appear here.</li>
        ) : (
          visibleEntries.map((entry) => (
            <li key={entry.id} className={`activity-log__entry activity-log__entry--${getLogEntryCategory(entry.type)}`}>
              <span className="activity-log__entry-icon" aria-hidden>{entryTypeIcon(entry.type)}</span>
              <span className="activity-log__entry-time">{formatTime(entry.createdAt)}</span>
              <span className="activity-log__entry-text">{formatEntryText(entry)}</span>
            </li>
          ))
        )}
      </ul>
    </>
  );

  if (asPanel) {
    return (
      <div className={`activity-log activity-log--panel ${panelCollapsed ? "activity-log--collapsed" : ""}`}>
        <button
          type="button"
          className="activity-log__panel-header"
          onClick={togglePanel}
          aria-expanded={!panelCollapsed}
          aria-controls="activity-log-panel-body"
        >
          <span className="activity-log__panel-title">Activity Log</span>
          <span className="activity-log__panel-count">{entries.length} entries</span>
          <span className="activity-log__panel-toggle" aria-hidden>{panelCollapsed ? "▲" : "▼"}</span>
        </button>
        <div id="activity-log-panel-body" className="activity-log__panel-body" hidden={panelCollapsed}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="activity-log activity-log--page">
      <h2 className="activity-log__page-title">Activity Log</h2>
      <p className="activity-log__page-desc">Recent combat, loot, level-ups, breakthroughs, and achievements.</p>
      {content}
    </div>
  );
};
