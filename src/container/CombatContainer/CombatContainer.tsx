import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { enemies } from "../../constants/data";
import images from "../../constants/images";
import EnemyI from "../../interfaces/EnemyI";
import Modal from "react-modal";
import "./CombatContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addItems } from "../../state/reducers/characterSlice";
import Item from "../../interfaces/ItemI";
import { changeContent } from "../../state/reducers/contentSlice";
import { ContentArea } from "../../enum/ContentArea";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "black",
  },
};
interface CombatAreaProps {
  area: string | undefined;
}

const CombatContainer: React.FC<CombatAreaProps> = ({ area }) => {
  const dispatch = useDispatch();

  //For the Modal
  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  //Character stats
  const character = useSelector((state: RootState) => state.character);
  //Character state to manipulate it
  const [characterState, setCharacterState] = useState(character);
  //ItemBag for holding items until pressing loot button
  const [itemBag, setItemBag] = useState<Item[]>([]);

  //For Progress Bar Value
  const [progressBarValue, setProgressBarValue] = useState(100);

  //Fetch currentEnemies for that area
  const currentEnemies = enemies.filter((enemy) => enemy.location.toString() === area);

  /**
   * Method to get a random new enemy from the current area
   * @returns  Enemy
   */
  const getRandomEnemy = () => {
    const random = Math.floor(Math.random() * currentEnemies.length);
    return currentEnemies[random];
  };

  const [currentEnemy, setCurrentEnemy] = useState(getRandomEnemy());
  //Start health for the progress bar
  const startEnemyHealth = currentEnemy.health;

  /**
   * Add items to redux state and clear item bag
   */
  const handleLootButton = () => {
    dispatch(addItems(itemBag));
    setItemBag([]);
  };

  /**
   * Escaping combat. Loots the ItemBag if it is not empty.
   * If the character died in combat and it is called, the item bag is not looted and reset.
   */
  const handleEscapeButton = (died: boolean) => {
    if (died) {
      setItemBag([]);
    } else {
      //Loot items
      if (itemBag.length !== 0) {
        handleLootButton();
      }
    }
    dispatch(changeContent(ContentArea.MAP));
  };

  /**
   * Adds 1 item from the enemy drop table to the item bag.
   */
  const addLootToItemBag = (enemy: EnemyI) => {
    const items = enemy.loot?.items;
    const weights = enemy.loot?.weight;

    if (!items) return;
    if (!weights) return;

    let i: number;

    for (i = 0; i < weights.length; i++) {
      weights[i] += weights[i - 1] || 0;
    }

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) {
      if (weights[i] > random) break;
    }

    setItemBag((prevItems) => [...prevItems, items[i]]);
    console.log("ItemBag" + itemBag);
    console.log("Item" + items[i]);
  };

  /**
   * Method to handle the fighting between an Enemy and the character
   *
   * If the enemy dies item is getting adding to the item bag.
   * If the character dies handleEscape is triggered with the death flag.
   */
  const handleFighting = () => {
    //Calculate enemy block chance
    const enemyblockChance = currentEnemy.defense - characterState.attack;
    const percentageEnemyBlockChance = enemyblockChance / (currentEnemy.defense + characterState.attack);

    //Calculate character block chance
    const characterblockChance = characterState.defense - currentEnemy.attack;
    const percentageCharacterBlockChance = characterblockChance / (characterState.defense + currentEnemy.attack);

    //Roll if hit
    const diceRoll = +Math.random().toFixed(2);
    //Booleans that say if a hit is going to happen
    const doesCharacterhit = diceRoll >= percentageEnemyBlockChance;
    const doesEnemyhit = diceRoll >= percentageCharacterBlockChance;

    //Character hit
    if (doesCharacterhit) {
      const damageDealt = +(Math.random() * characterState.attack).toFixed();
      setCurrentEnemy({
        id: currentEnemy.id,
        attack: currentEnemy.attack,
        defense: currentEnemy.defense,
        health: currentEnemy.health - damageDealt,
        location: currentEnemy.location,
        name: currentEnemy.name,
        loot: currentEnemy.loot,
        picture: currentEnemy.picture,
      });
    }

    //Enemy hit
    if (doesEnemyhit) {
      const damageDealt = +(Math.random() * currentEnemy.attack).toFixed();

      setCharacterState({
        attack: characterState.attack,
        defense: characterState.defense,
        health: characterState.health - damageDealt,
        items: characterState.items,
        miner: characterState.miner,
        money: characterState.money,
        name: characterState.name,
      });
    }

    //Case Enemy is dead
    if (currentEnemy.health <= 0) {
      addLootToItemBag(currentEnemy);
      setCurrentEnemy(getRandomEnemy());
    }
    //Case character dies
    if (characterState.health <= 0) {
      handleEscapeButton(true);
    }

    setProgressBarValue(Math.floor(startEnemyHealth / 100) * currentEnemy.health);
  };

  useEffect(() => {
    const fightingInterval = setInterval(() => handleFighting(), 2000);
    //Cleanup
    return () => clearInterval(fightingInterval);
  });

  return (
    <div className="combatContainer__main">
      <ProgressBar bgcolor="#6a1b9a" completed={progressBarValue} />
      <h3>{area}</h3>
      <div className="combatContainer__main-combat">
        {/* CharacterSection */}
        <div className="combatContainer__main-character">
          <img className="combatContainer__main-img" src={images.character} alt="You" />
        </div>
        {/* EnemySection */}
        <div className="combatContainer__main-enemy">
          <h4>{currentEnemy.name}</h4>
          <img className="combatContainer__main-img" src={currentEnemy.picture} />
          <table>
            <thead>
              <tr>
                <th>Attack</th>
                <th>Defense</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentEnemy.attack}</td>
                <td>{currentEnemy.defense}</td>
                <td>{currentEnemy.health}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="combatContainer__main-footer">
        <img src={images.bag} alt="Inventory Bag" onClick={() => setIsOpen(true)} />
        <Modal isOpen={isOpen} onRequestClose={toggleModal} contentLabel="item dialog" style={customStyles}>
          Loot Display
          {itemBag.map((item) => (
            <img key={item.id} src={item.picture} alt={item.name} style={{ maxWidth: "35px", maxHeight: "35px" }} />
          ))}
        </Modal>
        <button onClick={() => handleLootButton()}>Loot</button>
        <button onClick={() => handleEscapeButton(false)}>Escape</button>
      </div>
    </div>
  );
};

export default CombatContainer;
