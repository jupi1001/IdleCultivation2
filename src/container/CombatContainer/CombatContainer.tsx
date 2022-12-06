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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
interface CombatAreaProps {
  area: string;
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
  let itemBag: Item[] = [];

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
    //currentEnemy = currentEnemnies[random];
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
    itemBag = [];
  };

  /**
   * Escaping combat. Loots the ItemBag if it is not empty.
   * If the character died in combat and it is called, the item bag is not looted and reset.
   * @param died
   */
  const handleEscapeButton = (died: boolean) => {
    if (died) {
      itemBag = [];
    } else {
      //Loot items
      if (itemBag.length !== 0) {
        handleLootButton();
      }
    }
    dispatch(changeContent("Map"));
  };

  /**
   * Adds 1 item from the enemy drop table to the item bag.
   * @param enemy
   * @returns Nothing
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

    itemBag.push(items[i]);
  };

  /**
   * Method to handle the fighting between an Enemy and the character
   *
   * If the enemy dies item is getting adding to the item bag.
   * If the character dies handleEscape is triggered with the death flag.
   */
  const handleFighting = () => {
    console.log("---Fighting Cycle---");

    //Calculate enemy block chance
    const enemyblockChance = currentEnemy.defense - characterState.attack;
    //console.log("Block Enemy Chance: " + enemyblockChance + "=" + currentEnemy.defense + "-" + characterState.attack);
    const percentageEnemyBlockChance = enemyblockChance / (currentEnemy.defense + characterState.attack);
    //console.log("%Block Enemy: " + percentageEnemyBlockChance);

    //Calculate character block chance
    const characterblockChance = characterState.defense - currentEnemy.attack;
    const percentageCharacterBlockChance = characterblockChance / (characterState.defense + currentEnemy.attack);
    //console.log("%Block Character: " + percentageCharacterBlockChance);

    //Roll if hit
    const diceRoll = +Math.random().toFixed(2);
    //Booleans that say if a hit is going to happen
    const doesCharacterhit = diceRoll >= percentageEnemyBlockChance;
    const doesEnemyhit = diceRoll >= percentageCharacterBlockChance;
    //console.log("Dice Roll1: " + diceRoll);
    //console.log("Character Hit: " + doesCharacterhit);
    //console.log("Enemy Hit: " + doesEnemyhit);

    //Character hit
    if (doesCharacterhit) {
      const damageDealt = +(Math.random() * characterState.attack).toFixed();
      console.log("Damage Dealth to Enemy: " + damageDealt);
      setCurrentEnemy({
        id: currentEnemy.id,
        attack: currentEnemy.attack,
        defense: currentEnemy.defense,
        health: currentEnemy.health - damageDealt,
        location: currentEnemy.location,
        name: currentEnemy.name,
      });
      console.log("Enemy Health: " + currentEnemy.health);
    }

    //Enemy hit
    if (doesEnemyhit) {
      const damageDealt = +(Math.random() * currentEnemy.attack).toFixed();
      console.log("Damage Dealth to Character: " + damageDealt);

      setCharacterState({
        attack: characterState.attack,
        defense: characterState.defense,
        health: characterState.health - damageDealt,
        items: characterState.items,
        miner: characterState.miner,
        money: characterState.money,
        name: characterState.name,
      });
      console.log("Character Health: " + characterState.health);
    }
    //Case Enemy is dead
    if (currentEnemy.health <= 0) {
      addLootToItemBag(currentEnemy);
      setCurrentEnemy(getRandomEnemy());
      console.log("------Enemy is dead---------");
    }
    //Case character dies
    if (characterState.health <= 0) {
      handleEscapeButton(true);
      console.log("----Character is dead-----");
    }

    setProgressBarValue(Math.floor(startEnemyHealth / 100) * currentEnemy.health);
    console.log("Progress Bar: " + progressBarValue);
  };

  useEffect(() => {
    const fightingInterval = setInterval(() => handleFighting(), 5000);
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
        </Modal>
        <button onClick={() => handleLootButton()}>Loot</button>
        <button onClick={() => handleEscapeButton(false)}>Escape</button>
      </div>
    </div>
  );
};

export default CombatContainer;
