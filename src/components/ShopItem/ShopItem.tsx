import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAttack, addDefense, addItem, reduceMoney } from "../../state/reducers/characterSlice";
import { RootState } from "../../state/store";
import { getOwnedTechniqueIds } from "../../state/selectors/characterSelectors";
import Item from "../../interfaces/ItemI";
import "./ShopItem.css";

interface ShopItemProps {
  item: Item;
  isEquipment?: boolean;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, isEquipment }) => {
  const [moneyMessage, setMoneyMessage] = useState("hidden");

  const character = useSelector((state: RootState) => state.character);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const dispatch = useDispatch();
  const alreadyOwned = isEquipment && ownedTechniqueIds.has(item.id);

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

  const addEquipment = (cost: number) => {
    if (character.money >= cost) {
      dispatch(addItem({ ...item, quantity: 1 }));
      dispatch(reduceMoney(cost));
      setMoneyMessage("hidden");
    } else {
      setMoneyMessage("show");
    }
  };

  const showItem = isEquipment || item.quantity > 0;

  return (
    <>
      {showItem && (
        <div className="shopitem__main">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Cost: {item.price} Spirit Stones</p>
          {item.id < 100 && item.id > 0 && <button onClick={() => addAttackFunction(item.price, 1)}>Buy</button>}
          {item.id < 200 && item.id >= 100 && !item.equipmentSlot && <button onClick={() => addDefenseFunction(item.price, 1)}>Buy</button>}
          {item.id < 300 && item.id >= 200 && !item.equipmentSlot && <button onClick={() => addConsumable(item.price, 1)}>Buy</button>}
          {item.equipmentSlot && !alreadyOwned && <button onClick={() => addEquipment(item.price)}>Buy</button>}
          {item.equipmentSlot && alreadyOwned && <p className="shopitem__already">Already bought</p>}
          {moneyMessage === "show" && <h4>Not enough Spirit Stones</h4>}
        </div>
      )}
    </>
  );
};

export default ShopItem;
