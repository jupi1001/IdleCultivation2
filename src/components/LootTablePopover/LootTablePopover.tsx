import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Item from "../../interfaces/ItemI";
import "./LootTablePopover.css";

const BACKPACK_ICON = "/assets/ui/backpack.webp";
const HOVER_LEAVE_DELAY_MS = 150;

export interface LootTableEntry {
  item: Item;
  /** Optional drop chance (0–100). When set, shown next to the item. */
  chancePercent?: number;
}

interface LootTablePopoverProps {
  /** Legacy: flat list of possible items (no chance %, no owned). */
  items?: Item[];
  /** Preferred: entries with optional chance %. If set, used instead of items. */
  entries?: LootTableEntry[];
  /** When entries is used: item ids the character already owns (show checkmark). */
  ownedItemIds?: Set<number>;
  /** Optional label, e.g. "Possible finds" */
  label?: string;
}

const LootTablePopover: React.FC<LootTablePopoverProps> = ({
  items = [],
  entries,
  ownedItemIds,
  label = "Possible finds",
}) => {
  const [imgError, setImgError] = useState(false);
  const [hover, setHover] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const list: LootTableEntry[] = entries ?? items.map((item) => ({ item }));
  const listLength = list.length;

  const updatePopoverPosition = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    setPopoverStyle({
      position: "fixed",
      left: rect.left,
      bottom: typeof window !== "undefined" ? window.innerHeight - rect.top + 4 : rect.bottom + 4,
      minWidth: 140,
      maxWidth: 220,
      zIndex: 10001,
      pointerEvents: "auto",
    });
  }, []);

  const handleEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    updatePopoverPosition();
    setHover(true);
  }, [updatePopoverPosition]);

  const handleLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => setHover(false), HOVER_LEAVE_DELAY_MS);
  }, []);

  const handlePopoverEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHover(true);
  }, []);

  const handlePopoverLeave = useCallback(() => {
    setHover(false);
  }, []);

  if (listLength === 0) return null;

  const theme = typeof document !== "undefined" ? (document.body.getAttribute("data-theme") || "dark") : "dark";

  const popoverContent = hover ? (
    <div
      className="theme-wrap"
      data-theme={theme}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 10000,
      }}
    >
      <div
        className="lootTablePopover__popover lootTablePopover__popover--portal"
        style={popoverStyle}
        role="tooltip"
        onMouseEnter={handlePopoverEnter}
        onMouseLeave={handlePopoverLeave}
      >
        <ul className="lootTablePopover__list">
          {list.map((entry) => {
          const item = entry.item;
          const chancePercent = entry.chancePercent;
          const owned = ownedItemIds?.has(item.id);
          return (
            <li key={item.id} className="lootTablePopover__item">
              {item.picture ? (
                <img
                  src={item.picture}
                  alt=""
                  className="lootTablePopover__item-icon"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <span className="lootTablePopover__item-placeholder" />
              )}
              <span className="lootTablePopover__item-name">{item.name}</span>
              <span className="lootTablePopover__item-meta">
                {chancePercent != null && `${chancePercent}%`}
                {owned && (
                  <span className="lootTablePopover__owned" title="Already owned" aria-label="Already owned">
                    ✓
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
    </div>
  ) : null;

  return (
    <>
      <div
        ref={wrapRef}
        className="lootTablePopover__wrap"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <span className="lootTablePopover__label">{label}:</span>
        <div className="lootTablePopover__trigger" title={label}>
          {imgError ? (
            <span className="lootTablePopover__fallback">?</span>
          ) : (
            <img
              src={BACKPACK_ICON}
              alt=""
              className="lootTablePopover__icon"
              onError={() => setImgError(true)}
            />
          )}
        </div>
      </div>
      {typeof document !== "undefined" && createPortal(popoverContent, document.body)}
    </>
  );
};

export default LootTablePopover;
