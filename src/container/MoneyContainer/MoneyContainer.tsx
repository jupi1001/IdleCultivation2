import React from "react";
import { useDispatch } from "react-redux";
import { addMoney } from "../../state/reducers/characterSlice";
import "./MoneyContainer.css";

const MoneyContainer = () => {
  const dispatch = useDispatch();

  const getMoney = (value: number) => {
    dispatch(addMoney(value));
  };

  const getMiner = (value: number) => {
    dispatch(addMoney(value));
  };

  return (
    <div className="moneyContainer__main">
      <div className="moneyContainer__main-item">
        <h2>Collect Coins</h2>
        <button onClick={() => getMoney(1)}>Grab</button>
      </div>
      <div className="moneyContainer__main-item">
        <h2>Buy Miner</h2>
        <button onClick={() => getMiner(1)}>Buy</button>
      </div>
    </div>
  );
};

export default MoneyContainer;
