import React, { useEffect, useRef, useState } from "react";
import { enemies } from "../../constants/data";
import { getCharacterImage, UI_ASSETS } from "../../constants/ui";
import EnemyI from "../../interfaces/EnemyI";
import "./CombatContainer.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { addItems, addMoney, consumeItems, setCurrentHealth } from "../../state/reducers/characterSlice";
import { getEffectiveCombatStats } from "../../state/selectors/characterSelectors";
import Item from "../../interfaces/ItemI";
import { changeContent } from "../../state/reducers/contentSlice";
import { ContentArea } from "../../enum/ContentArea";
import { AREA_REALM_REQUIREMENTS, canEnterArea } from "../../constants/areaRealmRequirements";

const ENEMY_ATTACK_INTERVAL_MS = 3000;

interface CombatAreaProps {
  area: string | undefined;
}

const CombatContainer: React.FC<CombatAreaProps> = ({ area }) => {
  const dispatch = useDispatch();

  const character = useSelector((state: RootState) => state.character);
  const effectiveStats = useSelector(getEffectiveCombatStats);
  const [characterState, setCharacterState] = useState(() => ({
    ...effectiveStats,
    health: Math.min(effectiveStats.health, character.currentHealth),
  }));

  useEffect(() => {
    setCharacterState((prev) => ({
      ...effectiveStats,
      health: Math.min(prev.health, effectiveStats.health),
    }));
  }, [effectiveStats.attack, effectiveStats.defense, effectiveStats.health]);

  useEffect(() => {
    setCharacterState((prev) => ({
      ...prev,
      health: Math.min(effectiveStats.health, character.currentHealth),
    }));
  }, [character.currentHealth]);

  const [itemBag, setItemBag] = useState<Item[]>([]);
  const [lootSpiritStones, setLootSpiritStones] = useState(0);
  const [lastDamageToEnemy, setLastDamageToEnemy] = useState<number | null>(null);
  const [lastDamageToCharacter, setLastDamageToCharacter] = useState<number | null>(null);

  useEffect(() => {
    if (lastDamageToEnemy == null) return;
    const t = setTimeout(() => setLastDamageToEnemy(null), 2000);
    return () => clearTimeout(t);
  }, [lastDamageToEnemy]);

  useEffect(() => {
    if (lastDamageToCharacter == null) return;
    const t = setTimeout(() => setLastDamageToCharacter(null), 2000);
    return () => clearTimeout(t);
  }, [lastDamageToCharacter]);

  // Character attack speed (ms). Can be made dynamic later (e.g. from weapon).
  const [fightingInterval, setFightingInterval] = useState(2000);
  // Progress 0–100 for character and enemy attack bars
  const [characterProgress, setCharacterProgress] = useState(0);
  const [enemyProgress, setEnemyProgress] = useState(0);

  //Fetch currentEnemies for that area
  const currentEnemies = enemies.filter((enemy) => enemy.location.toString() === area);

  /**
   * Method to get a random new enemy from the current area
   * @returns  Enemy or undefined if area has no enemies
   */
  const getRandomEnemy = (): EnemyI | undefined => {
    if (currentEnemies.length === 0) return undefined;
    const random = Math.floor(Math.random() * currentEnemies.length);
    return currentEnemies[random];
  };

  const [currentEnemy, setCurrentEnemy] = useState<EnemyI | undefined>(() => getRandomEnemy());

  const enemyMaxHealth = currentEnemy
    ? (enemies.find((e) => e.id === currentEnemy.id)?.health ?? currentEnemy.health)
    : 1;

  const characterStateRef = useRef(characterState);
  const currentEnemyRef = useRef(currentEnemy);
  const lastCharAttackRef = useRef(Date.now());
  const lastEnemyAttackRef = useRef(Date.now());

  characterStateRef.current = characterState;
  currentEnemyRef.current = currentEnemy ?? null;

  // Redirect if no valid area, no enemies, or realm too low for this area
  useEffect(() => {
    if (!area || currentEnemies.length === 0) {
      dispatch(changeContent(ContentArea.MAP));
      return;
    }
    const required = AREA_REALM_REQUIREMENTS[area];
    if (required && !canEnterArea(character.realm, character.realmLevel, required)) {
      dispatch(changeContent(ContentArea.MAP));
    }
  }, [area, currentEnemies.length, character.realm, character.realmLevel, dispatch]);

  /** Food that restores vitality – use during combat to heal */
  const vitalityFood = character.items.filter(
    (i) => i.effect === "vitality" && i.value != null && (i.quantity ?? 1) > 0
  );

  const useVitalityFood = (item: Item) => {
    const heal = item.value ?? 0;
    if (heal <= 0) return;
    dispatch(consumeItems([{ itemId: item.id, amount: 1 }]));
    setCharacterState((prev) => ({
      ...prev,
      health: Math.min(effectiveStats.health, prev.health + heal),
    }));
  };

  /** Spirit stones awarded per kill (based on enemy max HP). */
  const getSpiritStonesFromEnemy = (enemy: EnemyI) => {
    const maxHp = enemies.find((e) => e.id === enemy.id)?.health ?? enemy.health;
    return Math.max(1, 2 + Math.floor(maxHp / 10));
  };

  /**
   * Add items and spirit stones to character, clear loot bag.
   */
  const handleLootButton = () => {
    if (lootSpiritStones > 0) {
      dispatch(addMoney(lootSpiritStones));
      setLootSpiritStones(0);
    }
    if (itemBag.length > 0) {
      dispatch(addItems(itemBag));
      setItemBag([]);
    }
  };

  /**
   * Escaping combat. Persists current HP to Redux, puts loot (items + spirit stones) in inventory (if any), then goes to Meditation.
   * If the character died, currentHealth is set to 0, loot bag is cleared.
   */
  const handleEscapeButton = (died: boolean) => {
    dispatch(setCurrentHealth(died ? 0 : characterState.health));
    if (died) {
      setItemBag([]);
      setLootSpiritStones(0);
    } else if (itemBag.length > 0 || lootSpiritStones > 0) {
      handleLootButton();
    }
    dispatch(changeContent(ContentArea.MEDITATION));
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
  };

  /** Character attacks on their own timer. Uses refs for latest state. */
  const doCharacterAttack = () => {
    const enemy = currentEnemyRef.current;
    const charState = characterStateRef.current;
    if (!enemy) return;

    const sum = enemy.defense + charState.attack;
    const percentageEnemyBlock = sum <= 0 ? 0 : (enemy.defense - charState.attack) / sum;
    const roll = Math.random();
    const doesHit = roll >= percentageEnemyBlock;

    if (doesHit) {
      const damage = charState.attack > 0 ? Math.floor(Math.random() * charState.attack) + 1 : 0;
      setLastDamageToEnemy(damage);
      const newHealth = enemy.health - damage;
      setCurrentEnemy({ ...enemy, health: newHealth });
      if (newHealth <= 0) {
        setLastDamageToEnemy(null);
        addLootToItemBag(enemy);
        setLootSpiritStones((prev) => prev + getSpiritStonesFromEnemy(enemy));
        setCurrentEnemy(getRandomEnemy());
      }
    }
    lastCharAttackRef.current = Date.now();
  };

  /** Enemy attacks on a fixed 3s timer. Uses refs for latest state. */
  const doEnemyAttack = () => {
    const enemy = currentEnemyRef.current;
    const charState = characterStateRef.current;
    if (!enemy) return;

    const sum = charState.defense + enemy.attack;
    const percentageCharBlock = sum <= 0 ? 0 : (charState.defense - enemy.attack) / sum;
    const roll = Math.random();
    const doesHit = roll >= percentageCharBlock;

    if (doesHit) {
      const damage = enemy.attack > 0 ? Math.floor(Math.random() * enemy.attack) + 1 : 0;
      setLastDamageToCharacter(damage);
      setCharacterState((prev) => {
        const newHealth = prev.health - damage;
        if (newHealth <= 0) setTimeout(() => handleEscapeButton(true), 0);
        return { ...prev, health: newHealth };
      });
    }
    lastEnemyAttackRef.current = Date.now();
  };

  // Character attack timer (attack speed)
  useEffect(() => {
    const id = setInterval(doCharacterAttack, fightingInterval);
    return () => clearInterval(id);
  }, [fightingInterval]);

  // Enemy attack timer (fixed 3s)
  useEffect(() => {
    const id = setInterval(doEnemyAttack, ENEMY_ATTACK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // Progress bars: tick every 50ms so bars fill smoothly
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setCharacterProgress(Math.min(100, ((now - lastCharAttackRef.current) / fightingInterval) * 100));
      setEnemyProgress(Math.min(100, ((now - lastEnemyAttackRef.current) / ENEMY_ATTACK_INTERVAL_MS) * 100));
    }, 50);
    return () => clearInterval(id);
  }, [fightingInterval]);

  if (!currentEnemy) return null;

  return (
    <div className="combatContainer__main">
      <h3>{area}</h3>
      <div className="combatContainer__bars">
        <div className="combatContainer__bar-group">
          <span className="combatContainer__bar-label">Your attack ({fightingInterval / 1000}s)</span>
          <div
            className="combatContainer__bar-track"
            role="progressbar"
            aria-valuenow={characterProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="combatContainer__bar-fill combatContainer__bar-fill--character"
              style={{ width: `${characterProgress}%` }}
            />
          </div>
        </div>
        <div className="combatContainer__bar-group">
          <span className="combatContainer__bar-label">Enemy attack (3s)</span>
          <div
            className="combatContainer__bar-track"
            role="progressbar"
            aria-valuenow={enemyProgress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="combatContainer__bar-fill combatContainer__bar-fill--enemy"
              style={{ width: `${enemyProgress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="combatContainer__main-combat">
        {/* CharacterSection */}
        <div className="combatContainer__main-character">
          <div className="combatContainer__portrait-wrap">
            <img className="combatContainer__main-img" src={getCharacterImage(character.gender ?? "Male", "default")} alt="You" />
            {lastDamageToCharacter != null && (
              <span className="combatContainer__damage combatContainer__damage--to-character">-{lastDamageToCharacter}</span>
            )}
          </div>
          <div className="combatContainer__hp-bar-wrap">
            <span className="combatContainer__hp-label">Vitality {characterState.health}/{effectiveStats.health}</span>
            <div className="combatContainer__hp-track" role="progressbar" aria-valuenow={characterState.health} aria-valuemin={0} aria-valuemax={effectiveStats.health}>
              <div className="combatContainer__hp-fill combatContainer__hp-fill--character" style={{ width: `${effectiveStats.health > 0 ? (characterState.health / effectiveStats.health) * 100 : 0}%` }} />
            </div>
          </div>
          <table className="combatContainer__stats">
            <thead>
              <tr>
                <th>Attack</th>
                <th>Defense</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{characterState.attack}</td>
                <td>{characterState.defense}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* EnemySection */}
        <div className="combatContainer__main-enemy">
          <h4>{currentEnemy.name}</h4>
          <div className="combatContainer__portrait-wrap">
            <img className="combatContainer__main-img" src={currentEnemy.picture} alt={currentEnemy.name} />
            {lastDamageToEnemy != null && (
              <span className="combatContainer__damage combatContainer__damage--to-enemy">-{lastDamageToEnemy}</span>
            )}
          </div>
          <div className="combatContainer__hp-bar-wrap">
            <span className="combatContainer__hp-label">Vitality {currentEnemy.health}/{enemyMaxHealth}</span>
            <div className="combatContainer__hp-track" role="progressbar" aria-valuenow={currentEnemy.health} aria-valuemin={0} aria-valuemax={enemyMaxHealth}>
              <div className="combatContainer__hp-fill combatContainer__hp-fill--enemy" style={{ width: `${enemyMaxHealth > 0 ? (currentEnemy.health / enemyMaxHealth) * 100 : 0}%` }} />
            </div>
          </div>
          <table className="combatContainer__stats">
            <thead>
              <tr>
                <th>Attack</th>
                <th>Defense</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentEnemy.attack}</td>
                <td>{currentEnemy.defense}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <section className="combatContainer__loot">
        <h4 className="combatContainer__loot-title">Loot bag</h4>
        {itemBag.length === 0 && lootSpiritStones === 0 ? (
          <p className="combatContainer__loot-empty">No loot yet</p>
        ) : (
          <div className="combatContainer__loot-grid">
            {lootSpiritStones > 0 && (
              <div className="combatContainer__loot-item combatContainer__loot-item--spirit-stones" title="Spirit stones from defeated enemies">
                <div className="combatContainer__loot-icon-wrap">
                  <img src={`${UI_ASSETS}/spirit-stone.webp`} alt="" className="combatContainer__loot-icon" />
                </div>
                <span className="combatContainer__loot-name">Spirit Stones</span>
                <span className="combatContainer__loot-amount">×{lootSpiritStones}</span>
              </div>
            )}
            {itemBag.map((item, index) => (
              <div key={`loot-${index}-${item.id}`} className="combatContainer__loot-item" title={item.description}>
                <div className="combatContainer__loot-icon-wrap">
                  {item.picture ? (
                    <img src={item.picture} alt="" className="combatContainer__loot-icon" />
                  ) : (
                    <div className="combatContainer__loot-icon-placeholder">?</div>
                  )}
                </div>
                <span className="combatContainer__loot-name">{item.name}</span>
                <span className="combatContainer__loot-amount">×{item.quantity ?? 1}</span>
              </div>
            ))}
          </div>
        )}
        <div className="combatContainer__loot-actions">
          <button type="button" className="combatContainer__btn combatContainer__btn--loot" onClick={() => handleLootButton()} disabled={itemBag.length === 0 && lootSpiritStones === 0}>
            Loot
          </button>
          <button type="button" className="combatContainer__btn combatContainer__btn--escape" onClick={() => handleEscapeButton(false)}>
            Escape
          </button>
        </div>
      </section>
      <div className="combatContainer__main-footer">
        {vitalityFood.length > 0 && (
          <div className="combatContainer__consumables">
            <span className="combatContainer__consumables-label">Food (heal):</span>
            {vitalityFood.map((item) => (
              <button
                key={item.id}
                type="button"
                className="combatContainer__use-food"
                onClick={() => useVitalityFood(item)}
                title={`${item.name}: restores ${item.value} vitality`}
              >
                {item.name} (+{item.value})
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatContainer;
