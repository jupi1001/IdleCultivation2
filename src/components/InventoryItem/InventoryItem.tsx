import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Item from "../../interfaces/ItemI";
import {
  addAttack,
  addDefense,
  addHealth,
  addQi,
  removeItem,
} from "../../state/reducers/characterSlice";
import "./InventoryItem.css";

interface InventoryItemProps {
  item: Item;
}

const InventoryItem: React.FC<InventoryItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const canUse =
    item.effect && item.value != null && ["attack", "defense", "vitality", "qi"].includes(item.effect);

  function useItem() {
    if (!canUse) return;
    dispatch(removeItem(item));
    if (item.effect === "attack" && item.value != null) dispatch(addAttack(item.value));
    if (item.effect === "defense" && item.value != null) dispatch(addDefense(item.value));
    if (item.effect === "vitality" && item.value != null) dispatch(addHealth(item.value));
    if (item.effect === "qi" && item.value != null) dispatch(addQi(item.value));
    setMenuOpen(false);
  }

  return (
    <div
      className="inventoryItem__main"
      title={item.description}
      onClick={() => setMenuOpen((o) => !o)}
    >
      <div className="inventoryItem__icon-wrap">
        {item.picture ? (
          <img src={item.picture} alt="" className="inventoryItem__icon" />
        ) : (
          <div className="inventoryItem__icon inventoryItem__icon--placeholder">?</div>
        )}
      </div>
      <span className="inventoryItem__name">{item.name}</span>
      <span className="inventoryItem__amount">×{item.quantity ?? 1}</span>
      <div className="inventoryItem__tooltip" role="tooltip">
        {item.description}
      </div>
      {menuOpen && (
        <>
          <div
            className="inventoryItem__backdrop"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(false);
            }}
            aria-hidden
          />
          <div className="inventoryItem__menu" onClick={(e) => e.stopPropagation()}>
            {canUse && (
              <button type="button" className="inventoryItem__menu-btn" onClick={useItem}>
                Use
              </button>
            )}
            <button
              type="button"
              className="inventoryItem__menu-btn"
              onClick={() => setMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryItem;
