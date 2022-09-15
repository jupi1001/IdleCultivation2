import Item from "../interfaces/ItemI";
import SkillI from "../interfaces/SkillI";

export const existingShopItems: Item[] = [
  {
    id: 1,
    name: "Wooden Sword",
    description: "A basic sword",
    price: 500,
    picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png",
    quantity: 1,
  },
  {
    id: 2,
    name: "Iron Sword",
    description: "An iron sword",
    price: 1000,
    picture: "https://www.pokewiki.de/images/thumb/7/72/Sugimori_386.png/250px-Sugimori_386.png",
    quantity: 1,
  },
  {
    id: 3,
    name: "Gold Sword",
    description: "A gold sword",
    price: 10000,
    picture: "https://www.pokewiki.de/images/thumb/7/72/Sugimori_386.png/250px-Sugimori_386.png",
    quantity: 1,
  },
];

export const existingSkills: SkillI[] = [
  { id: 1, name: "Combat", description: "Train combat" },
  { id: 2, name: "Money", description: "Make money" },
];
