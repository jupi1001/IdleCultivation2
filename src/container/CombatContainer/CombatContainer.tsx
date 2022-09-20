import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import { enemies } from "../../constants/data";
import images from "../../constants/images";
import { CombatArea } from "../../enum/CombatArea";
import EnemyI from "../../interfaces/EnemyI";
import Modal from "react-modal";
import "./CombatContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { reduceHealth } from "../../state/reducers/characterSlice";

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
  //For the Modal
  const [isOpen, setIsOpen] = useState(false);
  function toggleModal() {
    setIsOpen(!isOpen);
  }

  //Character stats
  const character = useSelector((state: RootState) => state.character);

  const dispatch = useDispatch();

  //For Progress Bar Value
  const [progressBarValue, setProgressBarValue] = useState(100);

  //Fetch currentEnemies for that area
  const currentEnemnies = enemies.filter((enemy) => enemy.location.toString() === area);

  //The enemy we currently fight against
  //let currentEnemy:EnemyI;

  //Method to get a random new enemy
  const getRandomEnemy = () => {
    const random = Math.floor(Math.random() * currentEnemnies.length);
    //currentEnemy = currentEnemnies[random];
    return currentEnemnies[random];
  };

  const [currentEnemy, setCurrentEnemy] = useState(getRandomEnemy());

  //Call it one time at the start?
  //getRandomEnemy();

  //TODO
  const handleLootButton = () => {};

  //TODO
  const handleEscapeButton = () => {};

  //TODO
  const handleFighting = () => {
    let enemyblockChance = currentEnemy.defense - character.attack;
    let percentageEnemyBlockChance = ((enemyblockChance / currentEnemy.defense + character.attack) * 100).toFixed(2);
    console.log("%Block Enemy: " + percentageEnemyBlockChance);

    let characterblockChance = character.defense - currentEnemy.attack;
    let percentageCharacterBlockChance = (
      (characterblockChance / character.defense + currentEnemy.attack) *
      100
    ).toFixed(2);
    console.log("%Block Character: " + percentageCharacterBlockChance);

    //Enemy copy to manipulate it
    let tempEnemy = currentEnemy;
    //Case Enemy is alive
    if (currentEnemy.health > 0) {
      //TODO damage calculation
      dispatch(reduceHealth(0));
      setCurrentEnemy(tempEnemy);
    } else {
      //Case Enemy is dead
      //TODO add loot
      setCurrentEnemy(getRandomEnemy());
    }

    setProgressBarValue(Math.floor(Math.random() * 100) + 1);
  };

  useEffect(() => {
    setInterval(() => handleFighting(), 5000);
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
        <button onClick={() => handleEscapeButton()}>Escape</button>
      </div>
    </div>
  );
};

export default CombatContainer;
