import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { purchaseAutoLootUnlock, purchaseAutoEatUnlock } from "../../state/reducers/settingsSlice";
import { reduceMoney } from "../../state/reducers/characterSlice";
import { selectMoney, selectAutoLootUnlocked, selectAutoEatUnlocked } from "../../state/selectors/characterSelectors";
import { existingShopItemUpgrades, existingShopItems, existingShopQiTechniques, existingShopCombatTechniques } from "../../constants/data";
import "./Shop.css";
import ShopItem from "../../components/ShopItem/ShopItem";

const AUTO_LOOT_PRICE = 5000;
const AUTO_EAT_PRICE = 50000;

export const Shop = () => {
  const dispatch = useDispatch();
  const money = useSelector(selectMoney);
  const autoLootUnlocked = useSelector(selectAutoLootUnlocked);
  const autoEatUnlocked = useSelector(selectAutoEatUnlocked);
  const [showPoorLoot, setShowPoorLoot] = React.useState(false);
  const [showPoorEat, setShowPoorEat] = React.useState(false);

  const buyAutoLoot = () => {
    if (autoLootUnlocked) return;
    if (money < AUTO_LOOT_PRICE) {
      setShowPoorLoot(true);
      return;
    }
    setShowPoorLoot(false);
    dispatch(reduceMoney(AUTO_LOOT_PRICE));
    dispatch(purchaseAutoLootUnlock());
  };

  const buyAutoEat = () => {
    if (autoEatUnlocked) return;
    if (money < AUTO_EAT_PRICE) {
      setShowPoorEat(true);
      return;
    }
    setShowPoorEat(false);
    dispatch(reduceMoney(AUTO_EAT_PRICE));
    dispatch(purchaseAutoEatUnlock());
  };

  return (
    <>
      <h2>Shop</h2>
      <div className="shop__main">
        <div className="shop__main-upgrades">
          {existingShopItemUpgrades.map((item, index) => (
            <ShopItem key={index} item={item} />
          ))}
        </div>
        <h3>Combat upgrades</h3>
        <div className="shop__main-upgrades">
          <div className="shopitem__main">
            <h3>Auto-Loot</h3>
            <p>Loot and spirit stones from defeated enemies go straight to your inventory. No need to click Loot.</p>
            <p>Cost: {AUTO_LOOT_PRICE} Spirit Stones</p>
            {!autoLootUnlocked && (
              <>
                <button type="button" onClick={buyAutoLoot}>Buy</button>
                {showPoorLoot && <p className="shop__poor">Not enough Spirit Stones</p>}
              </>
            )}
            {autoLootUnlocked && <p className="shopitem__already">Already purchased</p>}
          </div>
          <div className="shopitem__main">
            <h3>Auto-Eat</h3>
            <p>Automatically consume vitality food in combat when your HP drops to a set percentage. Configure the threshold in Settings.</p>
            <p>Cost: {AUTO_EAT_PRICE.toLocaleString()} Spirit Stones</p>
            {!autoEatUnlocked && (
              <>
                <button type="button" onClick={buyAutoEat}>Buy</button>
                {showPoorEat && <p className="shop__poor">Not enough Spirit Stones</p>}
              </>
            )}
            {autoEatUnlocked && <p className="shopitem__already">Already purchased</p>}
          </div>
        </div>
        <h3>Consumables</h3>
        <div className="shop__main-items">
          {existingShopItems.map((item, index) => (
            <ShopItem key={index} item={item} />
          ))}
        </div>
        <h3>Qi Techniques</h3>
        <div className="shop__main-items">
          {existingShopQiTechniques.map((item, index) => (
            <ShopItem key={index} item={item} isEquipment />
          ))}
        </div>
        <h3>Combat Techniques</h3>
        <div className="shop__main-items">
          {existingShopCombatTechniques.map((item, index) => (
            <ShopItem key={index} item={item} isEquipment />
          ))}
        </div>
      </div>
    </>
  );
};
