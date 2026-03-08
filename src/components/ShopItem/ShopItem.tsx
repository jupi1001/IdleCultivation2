import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Item from "../../interfaces/ItemI";
import { addAttack, addDefense, addItemById, reduceMoney } from "../../state/reducers/characterSlice";
import { getOwnedTechniqueIds, getTalentShopDiscountPercent } from "../../state/selectors/characterSelectors";
import { selectMoney } from "../../state/selectors/characterSelectors";
import "./ShopItem.css";

interface ShopItemProps {
  item: Item;
  isEquipment?: boolean;
}

const ShopItem: React.FC<ShopItemProps> = ({ item, isEquipment }) => {
  const [moneyMessage, setMoneyMessage] = useState(false);
  const [stock, setStock] = useState(item.quantity);

  const money = useSelector(selectMoney);
  const shopDiscountPercent = useSelector(getTalentShopDiscountPercent);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const dispatch = useDispatch();
  const effectivePrice = Math.max(1, Math.floor(item.price * (1 - (shopDiscountPercent ?? 0) / 100)));
  const alreadyOwned = isEquipment && ownedTechniqueIds.has(item.id);

  const buy = useCallback(() => {
    if (money < effectivePrice) {
      setMoneyMessage(true);
      return;
    }
    setMoneyMessage(false);
    dispatch(reduceMoney(effectivePrice));

    if (item.equipmentSlot) {
      dispatch(addItemById({ itemId: item.id, amount: 1 }));
      return;
    }

    switch (item.effect) {
      case "attack":
        dispatch(addAttack(item.value ?? 1));
        setStock((s) => s - 1);
        break;
      case "defense":
        dispatch(addDefense(item.value ?? 1));
        setStock((s) => s - 1);
        break;
      default:
        dispatch(addItemById({ itemId: item.id, amount: item.quantity ?? 1 }));
        break;
    }
  }, [dispatch, money, item, effectivePrice]);

  const showItem = isEquipment || stock > 0;
  const canBuy = !alreadyOwned;

  return (
    <>
      {showItem && (
        <div className="shopitem__main">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Cost: {effectivePrice === item.price ? item.price : `${effectivePrice} (was ${item.price})`} Spirit Stones</p>
          {canBuy && <button onClick={buy}>Buy</button>}
          {alreadyOwned && <p className="shopitem__already">Already bought</p>}
          {moneyMessage && <h4>Not enough Spirit Stones</h4>}
        </div>
      )}
    </>
  );
};

export default ShopItem;
