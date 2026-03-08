import React from "react";
import { useSelector } from "react-redux";
import InventoryItem from "../../components/InventoryItem/InventoryItem";
import { selectItems } from "../../state/selectors/characterSelectors";
import "./Inventory.css";

export const Inventory = () => {
  const items = useSelector(selectItems);

  return (
    <div className="inventory__main">
      <h2>Inventory</h2>
      {items.length === 0 ? (
        <p className="inventory__empty">Empty</p>
      ) : (
        <div className="inventory__grid">
          {items.map((item) => (
            <InventoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
