import React from "react";

import { existingShopItemUpgrades, existingShopItems, existingShopQiTechniques } from "../../constants/data";
import "./Shop.css";
import ShopItem from "../../components/ShopItem/ShopItem";

export const Shop = () => {
  return (
    <>
      <h2>Shop</h2>
      <div className="shop__main">
        <div className="shop__main-upgrades">
          {existingShopItemUpgrades.map((item, index) => (
            <ShopItem key={index} item={item} />
          ))}
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
      </div>
    </>
  );
};
