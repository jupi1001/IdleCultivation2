import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, reduceMoney } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
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
  const [showPoor, setShowPoor] = useState(false);
  const { item } = entry;

  const handleBuy = () => {
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
