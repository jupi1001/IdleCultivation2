import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { clearOfflineSummary } from "../../state/reducers/characterSlice";
import { OFFLINE_PROGRESS_CAP_MS } from "../../constants/offlineProgress";
import "./OfflineProgressModal.css";

function formatDuration(ms: number): string {
  if (ms < 60 * 1000) return `${Math.round(ms / 1000)}s`;
  if (ms < 60 * 60 * 1000) return `${Math.round(ms / 60000)}m`;
  const hours = Math.floor(ms / 3600000);
  const mins = Math.round((ms % 3600000) / 60000);
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function OfflineProgressModal() {
  const dispatch = useDispatch();
  const summary = useSelector((state: RootState) => state.character.lastOfflineSummary);

  if (summary == null) return null;

  const capped = summary.offlineMs >= OFFLINE_PROGRESS_CAP_MS;

  return (
    <div className="offlineModal-overlay" role="dialog" aria-modal="true" aria-labelledby="offline-modal-title">
      <div className="offlineModal">
        <h2 id="offline-modal-title" className="offlineModal__title">
          Welcome back
        </h2>
        <p className="offlineModal__subtitle">
          You were away for {formatDuration(summary.offlineMs)}
          {capped && " (max offline progress reached)"}.
        </p>

        <div className="offlineModal__gains">
          {summary.offlineQi > 0 && (
            <div className="offlineModal__row">
              <span className="offlineModal__label">Qi gained</span>
              <span className="offlineModal__value">+{Math.round(summary.offlineQi)}</span>
            </div>
          )}
          {summary.offlineSpiritStones > 0 && (
            <div className="offlineModal__row">
              <span className="offlineModal__label">Spirit Stones</span>
              <span className="offlineModal__value">+{Math.floor(summary.offlineSpiritStones).toLocaleString()}</span>
            </div>
          )}
          {summary.fishing && summary.fishing.casts > 0 && (
            <div className="offlineModal__row">
              <span className="offlineModal__label">Fishing</span>
              <span className="offlineModal__value">
                {summary.fishing.casts} casts, +{summary.fishing.xp} XP
                {summary.fishing.itemCount > 0 && `, ${summary.fishing.itemCount} items`}
              </span>
            </div>
          )}
          {summary.mining && summary.mining.casts > 0 && (
            <div className="offlineModal__row">
              <span className="offlineModal__label">Mining</span>
              <span className="offlineModal__value">
                {summary.mining.casts} casts, +{summary.mining.xp} XP
                {summary.mining.itemCount > 0 && `, ${summary.mining.itemCount} items`}
              </span>
            </div>
          )}
          {summary.gathering && summary.gathering.casts > 0 && (
            <div className="offlineModal__row">
              <span className="offlineModal__label">Gathering</span>
              <span className="offlineModal__value">
                {summary.gathering.casts} gathers, +{summary.gathering.xp} XP
                {summary.gathering.itemCount > 0 && `, ${summary.gathering.itemCount} items`}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          className="offlineModal__dismiss"
          onClick={() => dispatch(clearOfflineSummary())}
          autoFocus
        >
          Continue
        </button>
      </div>
    </div>
  );
}
