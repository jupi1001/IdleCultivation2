import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, reduceMoney } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
import { getOwnedTechniqueIds } from "../../state/selectors/characterSelectors";
import type { SectStoreEntryI } from "../../constants/data";
import "./SectStoreItem.css";

interface SectStoreItemProps {
  entry: SectStoreEntryI;
  locked: boolean;
  requiredPositionName: string;
  /** When buying from another sect on your path, show which sect this item is from. */
  sectName?: string;
}

export const SectStoreItem: React.FC<SectStoreItemProps> = ({ entry, locked, requiredPositionName, sectName }) => {
  const dispatch = useDispatch();
  const money = useSelector((state: RootState) => state.character.money);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const [showPoor, setShowPoor] = useState(false);
  const { item } = entry;
  const isTechnique = item.equipmentSlot === "qiTechnique" || item.equipmentSlot === "combatTechnique";
  const alreadyOwned = isTechnique && ownedTechniqueIds.has(item.id);

  const handleBuy = () => {
    if (alreadyOwned) return;
    if (money < item.price) {
      setShowPoor(true);
      return;
    }
    dispatch(reduceMoney(item.price));
    dispatch(addItem({ ...item, quantity: 1 }));
    setShowPoor(false);
  };

  return (
    <div className={`sectStoreItem ${locked ? "sectStoreItem--locked" : ""}`}>
      <h4 className="sectStoreItem__name">{item.name}</h4>
      {sectName != null && (
        <p className="sectStoreItem__from">From: {sectName}</p>
      )}
      <p className="sectStoreItem__desc">{item.description}</p>
      <p className="sectStoreItem__price">Cost: {item.price} Spirit Stones</p>
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
};
