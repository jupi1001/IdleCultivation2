import React, { useState } from "react";
import Item from "../../interfaces/ItemI";
import { UI_ASSETS } from "../../constants/ui";
import "./EnemyLootPopover.css";

const BACKPACK_ICON = "/assets/ui/backpack.webp";

export interface EnemyLootEntry {
  item: Item;
  chancePercent: number;
  amount: number;
}

interface EnemyLootPopoverProps {
  /** Spirit stones guaranteed per kill */
  spiritStoneAmount: number;
  /** Item drops: chance % and amount per drop */
  lootEntries: EnemyLootEntry[];
  /** Technique item ids the character already owns (show checkmark, drop won't give duplicate) */
  ownedTechniqueIds?: Set<number>;
  label?: string;
}

const EnemyLootPopover: React.FC<EnemyLootPopoverProps> = ({
  spiritStoneAmount,
  lootEntries,
  ownedTechniqueIds,
  label = "Possible loot",
}) => {
  const [imgError, setImgError] = useState(false);
  const [hover, setHover] = useState(false);

  const hasLoot = spiritStoneAmount > 0 || lootEntries.length > 0;
  if (!hasLoot) return null;

  return (
    <div
      className="enemyLootPopover__wrap"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="enemyLootPopover__label">{label}:</span>
      <div className="enemyLootPopover__trigger" title={label}>
        {imgError ? (
          <span className="enemyLootPopover__fallback">?</span>
        ) : (
          <img
            src={BACKPACK_ICON}
            alt=""
            className="enemyLootPopover__icon"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {hover && (
        <div className="enemyLootPopover__popover" role="tooltip">
          <ul className="enemyLootPopover__list">
            {spiritStoneAmount > 0 && (
              <li className="enemyLootPopover__item">
                <img
                  src={`${UI_ASSETS}/spirit-stone.webp`}
                  alt=""
                  className="enemyLootPopover__item-icon"
                />
                <span className="enemyLootPopover__item-name">Spirit Stones</span>
                <span className="enemyLootPopover__item-meta">100% ×{spiritStoneAmount}</span>
              </li>
            )}
            {lootEntries.map(({ item, chancePercent, amount }) => {
              const isTechnique = item.equipmentSlot === "qiTechnique" || item.equipmentSlot === "combatTechnique";
              const alreadyOwned = isTechnique && ownedTechniqueIds?.has(item.id);
              return (
                <li key={item.id} className="enemyLootPopover__item" title={item.description}>
                  {item.picture ? (
                    <img
                      src={item.picture}
                      alt=""
                      className="enemyLootPopover__item-icon"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="enemyLootPopover__item-placeholder" />
                  )}
                  <span className="enemyLootPopover__item-name">{item.name}</span>
                  <span className="enemyLootPopover__item-meta">
                    {chancePercent.toFixed(0)}% ×{amount}
                    {alreadyOwned && (
                      <span className="enemyLootPopover__owned" title="Already owned"> ✓</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnemyLootPopover;
