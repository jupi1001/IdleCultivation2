import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAttack, reduceMoney } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
import "./Shop.css";

export const Shop = () => {
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

  return (
    <div>
      Shop
      {moneyMessage === "show" && <h2>Not enough Money</h2>}
      <div>First</div>
      <button onClick={() => addAttackFunction(100, 100)}>Click</button>
    </div>
  );
};
