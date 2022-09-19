import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAttack, addDefense, addItem, reduceMoney } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
import Item from "../../interfaces/ItemI";
import "./ShopItem.css";

interface ShopItemProps {
  item: Item;
}

const ShopItem: React.FC<ShopItemProps> = ({ item }) => {
  const [moneyMessage, setMoneyMessage] = useState("hidden");

  const character = useSelector((state: RootState) => state.character);
  const dispatch = useDispatch();

  const addAttackFunction = (cost: number, amount: number) => {
    if (character.money >= cost) {
      dispatch(addAttack(amount));
      dispatch(reduceMoney(cost));
      setMoneyMessage("hidden");
      item.quantity--;
    } else {
      setMoneyMessage("show");
    }
  };

  const addDefenseFunction = (cost: number, amount: number) => {
    if (character.money >= cost) {
      dispatch(addDefense(amount));
      dispatch(reduceMoney(cost));
      setMoneyMessage("hidden");
      item.quantity--;
    } else {
      setMoneyMessage("show");
    }
  };

  const addConsumable = (cost: number, amount: number) => {
    if (character.money >= cost) {
      dispatch(addItem(item));
      dispatch(reduceMoney(cost));
      setMoneyMessage("hidden");
    } else {
      setMoneyMessage("show");
    }
  };

  return (
    <>
      {item.quantity > 0 && (
        <div className="shopitem__main">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Cost: {item.price}</p>
          {/* Dumb check if it is attack or defensive item or consumable */}
          {item.id < 100 && item.id > 0 && <button onClick={() => addAttackFunction(item.price, 1)}>Buy</button>}
          {item.id < 200 && item.id >= 100 && <button onClick={() => addDefenseFunction(item.price, 1)}>Buy</button>}
          {item.id < 300 && item.id >= 200 && <button onClick={() => addConsumable(item.price, 1)}>Buy</button>}
          {moneyMessage === "show" && <h4>Not enough Money</h4>}
        </div>
      )}
    </>
  );
};

export default ShopItem;
