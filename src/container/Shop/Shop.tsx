import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { purchaseAutoLootUnlock } from "../../state/reducers/characterSlice";
import { existingShopItemUpgrades, existingShopItems, existingShopQiTechniques, existingShopCombatTechniques } from "../../constants/data";
import "./Shop.css";
import ShopItem from "../../components/ShopItem/ShopItem";

const AUTO_LOOT_PRICE = 5000;

export const Shop = () => {
  const dispatch = useDispatch();
  const money = useSelector((state: RootState) => state.character.money);
  const autoLootUnlocked = useSelector((state: RootState) => state.character.autoLootUnlocked);
  const [showPoor, setShowPoor] = React.useState(false);

  const buyAutoLoot = () => {
    if (autoLootUnlocked) return;
    if (money < AUTO_LOOT_PRICE) {
      setShowPoor(true);
      return;
    }
    setShowPoor(false);
    dispatch(purchaseAutoLootUnlock());
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
                {showPoor && <p className="shop__poor">Not enough Spirit Stones</p>}
              </>
            )}
            {autoLootUnlocked && <p className="shopitem__already">Already purchased</p>}
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
