import React, { useState } from "react";
import Item from "../../interfaces/ItemI";
import "./LootTablePopover.css";

const BACKPACK_ICON = "/assets/ui/backpack.webp";

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

  const list: LootTableEntry[] = entries ?? items.map((item) => ({ item }));
  if (list.length === 0) return null;

  return (
    <div
      className="lootTablePopover__wrap"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
      {hover && (
        <div className="lootTablePopover__popover" role="tooltip">
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
                  {(chancePercent != null || owned) && (
                    <span className="lootTablePopover__item-meta">
                      {chancePercent != null && `${chancePercent}%`}
                      {owned && <span className="lootTablePopover__owned" title="Already owned"> ✓</span>}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LootTablePopover;
