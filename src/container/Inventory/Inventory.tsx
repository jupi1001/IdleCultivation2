import React from "react";
import { useSelector } from "react-redux";
import InventoryItem from "../../components/InventoryItem/InventoryItem";
import { RootState } from "../../state/store";
import "./Inventory.css";

export const Inventory = () => {
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="inventory__main">
      <h2>Inventory</h2>
      {character.items.length === 0 ? (
        <p className="inventory__empty">Empty</p>
      ) : (
        <div className="inventory__grid">
          {character.items.map((item) => (
            <InventoryItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
