import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { SectStoreEntryI } from "../../constants/data";
import { addItemById, reduceMoney } from "../../state/reducers/characterSlice";
import { getOwnedTechniqueIds, getTalentShopDiscountPercent, selectMoney } from "../../state/selectors/characterSelectors";
import { formatItemStats } from "../../utils/itemTooltipUtils";
import { Tooltip } from "../Tooltip/Tooltip";
import "./SectStoreItem.css";

interface SectStoreItemProps {
  entry: SectStoreEntryI;
  locked: boolean;
  requiredPositionName: string;
  /** When buying from another sect on your path, show which sect this item is from. */
  sectName?: string;
}

export const SectStoreItem: React.FC<SectStoreItemProps> = React.memo(({ entry, locked, requiredPositionName, sectName }) => {
  const dispatch = useDispatch();
  const money = useSelector(selectMoney);
  const shopDiscountPercent = useSelector(getTalentShopDiscountPercent);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const [showPoor, setShowPoor] = useState(false);
  const { item } = entry;
  const effectivePrice = Math.max(1, Math.floor(item.price * (1 - (shopDiscountPercent ?? 0) / 100)));
  const isTechnique = item.equipmentSlot === "qiTechnique" || item.equipmentSlot === "combatTechnique";
  const alreadyOwned = isTechnique && ownedTechniqueIds.has(item.id);

  const handleBuy = () => {
    if (alreadyOwned) return;
    if (money < effectivePrice) {
      setShowPoor(true);
      return;
    }
    dispatch(reduceMoney(effectivePrice));
    dispatch(addItemById({ itemId: item.id, amount: 1 }));
    setShowPoor(false);
  };

  return (
    <div className={`sectStoreItem ${locked ? "sectStoreItem--locked" : ""}`}>
      <Tooltip content={formatItemStats(item)} placement="top" maxWidth={280}>
        <h4 className="sectStoreItem__name">{item.name}</h4>
      </Tooltip>
      {sectName != null && (
        <p className="sectStoreItem__from">From: {sectName}</p>
      )}
      <p className="sectStoreItem__desc">{item.description}</p>
      <p className="sectStoreItem__price">Cost: {effectivePrice === item.price ? item.price : `${effectivePrice} (was ${item.price})`} Spirit Stones</p>
      {locked ? (
        <p className="sectStoreItem__requires">Requires: {requiredPositionName}</p>
      ) : alreadyOwned ? (
        <p className="sectStoreItem__already">Already owned</p>
      ) : (
        <>
          <button type="button" className="sectStoreItem__buy" onClick={handleBuy}>
            Buy
          </button>
          {showPoor && <p className="sectStoreItem__poor">Not enough Spirit Stones</p>}
        </>
      )}
    </div>
  );
});
