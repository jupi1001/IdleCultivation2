import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { dismissToast } from "../../state/reducers/toastSlice";
import { TOAST_AUTO_DISMISS_MS } from "../../state/reducers/toastSlice";
import type { ToastI } from "../../state/reducers/toastSlice";
import "./Toast.css";

/** Skill icon paths: under each skill folder, e.g. public/assets/fishing/icon.webp. Use alt with first letter until images exist. */
const SKILL_ICON_PATHS: Record<string, string> = {
  Fishing: "/assets/fishing/skill-icon.webp",
  Mining: "/assets/mining/skill-icon.webp",
  Gathering: "/assets/gathering/skill-icon.webp",
  Cooking: "/assets/cooking/skill-icon.webp",
  Alchemy: "/assets/alchemy/skill-icon.webp",
  Forging: "/assets/forging/skill-icon.webp",
};

function ToastItem({ toast }: { toast: ToastI }) {
  const dispatch = useDispatch();
  const [elapsed, setElapsed] = useState(0);
  const createdAt = toast.createdAt;

  useEffect(() => {
    const start = createdAt;
    const tick = () => {
      const now = Date.now();
      const e = Math.min(TOAST_AUTO_DISMISS_MS, now - start);
      setElapsed(e);
      if (e >= TOAST_AUTO_DISMISS_MS) {
        dispatch(dismissToast(toast.id));
      }
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [createdAt, dispatch, toast.id]);

  const remainingPercent = 100 - Math.min(100, (elapsed / TOAST_AUTO_DISMISS_MS) * 100);

  const renderBody = () => {
    if (toast.type === "expedition") {
      return (
        <>
          <p className="toast-item__title">{toast.expeditionName} — completed</p>
          <div className="toast-item__body">
            <p className="toast-item__loot">Spirit Stones: +{toast.spiritStones ?? 0}</p>
            {toast.rareItemName && (
              <p className="toast-item__loot toast-item__loot--rare">Rare: {toast.rareItemName}</p>
            )}
          </div>
        </>
      );
    }
    if (toast.type === "levelUp") {
      const skillName = toast.skill ?? "Skill";
      const iconPath = SKILL_ICON_PATHS[skillName];
      return (
        <div className="toast-item__level-up">
          <div className="toast-item__skill-icon-wrap">
            {iconPath ? (
              <img
                src={iconPath}
                alt={skillName.charAt(0)}
                className="toast-item__skill-icon"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.hidden = false;
                }}
              />
            ) : null}
            <span className="toast-item__skill-icon-fallback" hidden={!!iconPath} aria-hidden>
              {skillName.charAt(0)}
            </span>
          </div>
          <div className="toast-item__level-up-text">
            <span className="toast-item__level-up-level">Level {toast.level ?? 0}</span>
            <span className="toast-item__level-up-achieved"> achieved</span>
          </div>
        </div>
      );
    }
    // rareDrop (title = item name: Geode or ring/amulet name)
    const title = toast.itemName ?? "Rare find";
    return <p className="toast-item__title">{title}</p>;
  };

  return (
    <div className="toast-item" role="status" aria-live="polite">
      <div className="toast-item__content">
        <div className="toast-item__main">
          {renderBody()}
        </div>
        <button
          type="button"
          className="toast-item__dismiss"
          onClick={() => dispatch(dismissToast(toast.id))}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
      <div
        className="toast-item__bar-wrap"
        role="progressbar"
        aria-valuenow={Math.round(remainingPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Time until dismiss"
      >
        <div
          className="toast-item__bar"
          style={{ width: `${remainingPercent}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.toast.toasts);
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map((toast: ToastI) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
