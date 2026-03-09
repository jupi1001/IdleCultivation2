import React from "react";
import { existingBlackMarketItems } from "../../constants/data";
import { getEquipmentSlot } from "../../interfaces/ItemI";
import "../Shop/Shop.css";
import ShopItem from "../../components/ShopItem/ShopItem";

export const BlackMarket = () => {
  return (
    <>
      <h2>Shadow Bazaar</h2>
      <p className="shop__subtitle">Rare and forbidden wares. No questions asked.</p>
      <div className="shop__main">
        <div className="shop__main-items">
          {existingBlackMarketItems.map((item, index) => (
            <ShopItem
              key={item.id}
              item={item}
              isEquipment={getEquipmentSlot(item) != null}
            />
          ))}
        </div>
      </div>
    </>
  );
};
