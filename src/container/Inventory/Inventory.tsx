import React from "react";
import { useDispatch, useSelector } from "react-redux";
import InventoryItem from "../../components/InventoryItem/InventoryItem";
import { RootState } from "../../state/store";

export const Inventory = () => {
  const character = useSelector((state: RootState) => state.character);

  return (
    <div className="inventory__main">
      {character.items.length === 0 && <h2>Empty</h2>}
      {character.items.map((item, index) => (
        <InventoryItem key={index} item={item} />
      ))}
    </div>
  );
};
