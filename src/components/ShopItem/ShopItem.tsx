import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAttack, addDefense, reduceMoney } from "../../state/reducers/characterSlice";
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
    } else {
      setMoneyMessage("show");
    }
  };

  const addDefenseFunction = (cost: number, amount: number) => {
    if (character.money >= cost) {
      dispatch(addDefense(amount));
      dispatch(reduceMoney(cost));
    } else {
      setMoneyMessage("show");
    }
  };

  return (
    <div className="shopitem__main">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {/* 
      Dumb check if it is attack or defensive item
       id < 100 => attack otherwise defense 
       */}
      {item.id < 100 && <button onClick={() => addAttackFunction(item.price, 1)}>Buy</button>}
      {item.id > 100 && <button onClick={() => addDefenseFunction(item.price, 1)}>Buy</button>}
      {moneyMessage === "show" && <h4>Not enough Money</h4>}
    </div>
  );
};

export default ShopItem;
