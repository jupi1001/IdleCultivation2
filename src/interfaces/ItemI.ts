import React from "react";

interface Item {
  id: number;
  name: string;
  description: string;
  //For the shop and inventory
  quantity: number;
  //For the shop and maybe selling
  price: number;
  //To display
  picture?: string;
  //For Consumables
  value?: number;
  effect?: string;
}

export default Item;
