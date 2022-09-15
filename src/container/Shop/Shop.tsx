import React from "react";

import { existingShopItems } from "../../constants/data";
import "./Shop.css";
import ShopItem from "../../components/ShopItem/ShopItem";

export const Shop = () => {
  return (
    <>
      <h2>Shop</h2>
      <div className="shop__main">
        {existingShopItems.map((item, index) => (
          <ShopItem key={index} item={item} />
        ))}
      </div>
    </>
  );
};
