import React, { useState } from "react";
import Item from "../../interfaces/ItemI";
import "./LootTablePopover.css";

const BACKPACK_ICON = "/assets/ui/backpack.png";

interface LootTablePopoverProps {
  /** Possible items from this location (from data; fully dynamic when new items are added). */
  items: Item[];
  /** Optional label, e.g. "Possible finds" */
  label?: string;
}

const LootTablePopover: React.FC<LootTablePopoverProps> = ({
  items,
  label = "Possible finds",
}) => {
  const [imgError, setImgError] = useState(false);
  const [hover, setHover] = useState(false);

  if (items.length === 0) return null;

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
            {items.map((item) => (
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LootTablePopover;
