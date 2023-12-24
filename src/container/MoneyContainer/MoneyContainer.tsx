import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMoney, addMiner, reduceMoney } from "../../state/reducers/characterSlice";
import "./MoneyContainer.css";
import { RootState } from "../../state/store";

const MoneyContainer = () => {
  const dispatch = useDispatch();
  const character = useSelector((state: RootState) => state.character);

  const getMoney = (value: number) => {
    dispatch(addMoney(value));
  };

  const getMiner = (value: number) => {
    if (character.money > 100) {
      dispatch(addMiner(value));
      dispatch(reduceMoney(100));
    }
  };

  return (
    <div className="moneyContainer__main">
      <div className="moneyContainer__main-item">
        <h2>Collect Coins</h2>
        <button onClick={() => getMoney(1)}>Grab 1 Coin</button>
      </div>
      <div className="moneyContainer__main-item">
        <h2>Buy Miner</h2>
        <span>Cost: 100 Coins</span>
        <button onClick={() => getMiner(1)}>Buy</button>
      </div>
    </div>
  );
};

export default MoneyContainer;
