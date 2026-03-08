import React, { useEffect, useMemo, useRef, useState } from "react";
import EnemyLootPopover from "../../components/EnemyLootPopover/EnemyLootPopover";
import { ENEMIES_BY_ID, SECTS_BY_ID } from "../../constants/data";
import { getCharacterImage, UI_ASSETS } from "../../constants/ui";
import { CombatArea } from "../../enum/CombatArea";
import { ContentArea } from "../../enum/ContentArea";
import EnemyI from "../../interfaces/EnemyI";
import "./CombatContainer.css";
import { useDispatch, useSelector } from "react-redux";
import Item from "../../interfaces/ItemI";
import { addItemById, addItemsById, addMoney, consumeItems, setCurrentHealth, setWeakened, recordEnemyKill, recordDeath, incrementSectQuestKillCount } from "../../state/reducers/characterSlice";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import { addLogEntry } from "../../state/reducers/logSlice";
import { getEffectiveCombatStats, getOwnedTechniqueIds, getTalentSpiritStoneMultiplier } from "../../state/selectors/characterSelectors";
import {
  selectCurrentHealth,
  selectRealm,
  selectRealmLevel,
  selectItems,
  selectDeathPenaltyMode,
  selectCurrentSectId,
  selectPath,
  selectSectRankIndex,
  selectGender,
  selectAutoLoot,
  selectAutoEatUnlocked,
  selectAutoEat,
  selectAutoEatHpPercent,
} from "../../state/selectors/characterSelectors";
import { isConsumableItem } from "../../types/itemGuards";
import { getResolvedLootTable, rollOneDrop } from "../../utils/combatLoot";
import { canEnterCombatArea } from "../../utils/contentRules";

const ENEMY_ATTACK_INTERVAL_MS = 3000;

interface CombatAreaProps {
  area: string | undefined;
}

const CombatContainer: React.FC<CombatAreaProps> = ({ area }) => {
  const dispatch = useDispatch();

  const currentHealth = useSelector(selectCurrentHealth);
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const items = useSelector(selectItems);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const currentSectId = useSelector(selectCurrentSectId);
  const path = useSelector(selectPath);
  const sectRankIndex = useSelector(selectSectRankIndex);
  const gender = useSelector(selectGender);
  const autoLoot = useSelector(selectAutoLoot);
  const autoEatUnlocked = useSelector(selectAutoEatUnlocked);
  const autoEat = useSelector(selectAutoEat);
  const autoEatHpPercent = useSelector(selectAutoEatHpPercent);
  const effectiveStats = useSelector(getEffectiveCombatStats);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const talentSpiritStoneMult = useSelector(getTalentSpiritStoneMultiplier);
  const [characterState, setCharacterState] = useState(() => ({
    ...effectiveStats,
    health: Math.min(effectiveStats.health, currentHealth),
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
      health: Math.min(effectiveStats.health, currentHealth),
    }));
  }, [currentHealth]);

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

  const BASE_ATTACK_INTERVAL_MS = 2000;
  const MIN_ATTACK_INTERVAL_MS = 500;
  const fightingInterval = Math.max(MIN_ATTACK_INTERVAL_MS, BASE_ATTACK_INTERVAL_MS - (effectiveStats.attackSpeedReduction ?? 0));
  // Progress 0–100 for character and enemy attack bars
  const [characterProgress, setCharacterProgress] = useState(0);
  const [enemyProgress, setEnemyProgress] = useState(0);

  //Fetch currentEnemies for that area
  const currentEnemies = Object.values(ENEMIES_BY_ID).filter((enemy) => enemy.location.toString() === area);

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
    ? (ENEMIES_BY_ID[currentEnemy.id]?.health ?? currentEnemy.health)
    : 1;

  const characterStateRef = useRef(characterState);
  const currentEnemyRef = useRef<EnemyI | null>(currentEnemy ?? null);
  const lastCharAttackRef = useRef(Date.now());
  const lastEnemyAttackRef = useRef(Date.now());
  const ownedTechniqueIdsRef = useRef(ownedTechniqueIds);
  const combatContextRef = useRef({
    currentSectId,
    path,
    sectRankIndex,
    items,
    autoLoot,
    autoEatUnlocked,
    autoEat,
    autoEatHpPercent,
  });
  combatContextRef.current = {
    currentSectId,
    path,
    sectRankIndex,
    items,
    autoLoot,
    autoEatUnlocked,
    autoEat,
    autoEatHpPercent,
  };
  const talentBonusesRef = useRef(effectiveStats.talentBonuses);
  const talentSpiritStoneMultRef = useRef(talentSpiritStoneMult);
  const effectiveStatsRef = useRef(effectiveStats);

  characterStateRef.current = characterState;
  currentEnemyRef.current = currentEnemy ?? null;
  ownedTechniqueIdsRef.current = ownedTechniqueIds;
  talentBonusesRef.current = effectiveStats.talentBonuses;
  talentSpiritStoneMultRef.current = talentSpiritStoneMult;
  effectiveStatsRef.current = effectiveStats;

  // Redirect if no valid area, no enemies, or realm too low for this area
  useEffect(() => {
    if (!area || currentEnemies.length === 0) {
      dispatch(changeContent(routeFromArea(ContentArea.MAP)));
      return;
    }
    if (!canEnterCombatArea(realm, realmLevel, area)) {
      dispatch(changeContent(routeFromArea(ContentArea.MAP)));
    }
  }, [area, currentEnemies.length, realm, realmLevel, dispatch]);

  /** Food that restores vitality – use during combat to heal */
  const vitalityFood = items.filter(
    (i): i is Item & { effect: string; value: number } =>
      isConsumableItem(i) && i.effect === "vitality" && i.value != null && (i.quantity ?? 1) > 0
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.getAttribute("contenteditable") === "true") return;
      if (e.key >= "1" && e.key <= "9") {
        const idx = e.key.charCodeAt(0) - "1".charCodeAt(0);
        const item = vitalityFood[idx];
        if (item) {
          e.preventDefault();
          useVitalityFood(item);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [vitalityFood, effectiveStats.health]);

  /** Spirit stones awarded per kill (scaled by enemy max HP for stronger rewards). */
  const getSpiritStonesFromEnemy = (enemy: EnemyI) => {
    const maxHp = ENEMIES_BY_ID[enemy.id]?.health ?? enemy.health;
    return Math.max(1, 5 + Math.floor(maxHp / 5));
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
      dispatch(addItemsById(itemBag.map((i) => ({ itemId: i.id, amount: i.quantity ?? 1 }))));
      setItemBag([]);
    }
  };

  /**
   * Escaping combat. Persists current HP to Redux, puts loot (items + spirit stones) in inventory (if any), then goes to Meditation.
   * If the character died, currentHealth is set to 0, loot bag is cleared. In normal death penalty mode, weakened state is applied.
   */
  const handleEscapeButton = (died: boolean) => {
    dispatch(setCurrentHealth(died ? 0 : characterState.health));
      if (died) {
      setItemBag([]);
      setLootSpiritStones(0);
      if (deathPenaltyMode === "normal") {
        dispatch(setWeakened(true));
      }
      dispatch(recordDeath());
    } else if (itemBag.length > 0 || lootSpiritStones > 0) {
      handleLootButton();
    }
    dispatch(changeContent(routeFromArea(ContentArea.MEDITATION)));
  };

  /**
   * Rolls once on the enemy loot table; returns the dropped item or null (e.g. technique already owned).
   * Uses combatLoot for normal vs sect raid resolution.
   */
  const rollOneLootDrop = (enemy: EnemyI): Item | null => {
    const context = { area, currentSectId, path, sectRankIndex };
    const table = getResolvedLootTable(enemy, context);
    return rollOneDrop(table, ownedTechniqueIdsRef.current);
  };

  /**
   * Adds 1 item from the enemy drop table to the item bag. Techniques (qi/combat) are only added once per character; duplicates are skipped.
   * Calls onItemDropped with the item when one is actually added (for activity log).
   */
  const addLootToItemBag = (enemy: EnemyI, onItemDropped?: (item: Item) => void) => {
    const dropped = rollOneLootDrop(enemy);
    if (!dropped) return;
    onItemDropped?.(dropped);
    setItemBag((prevItems) => [...prevItems, dropped]);
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
      let damage = charState.attack > 0 ? Math.floor(Math.random() * charState.attack) + 1 : 0;
      const bonuses = talentBonusesRef.current;
      if (bonuses.critChancePercent > 0 && Math.random() * 100 < bonuses.critChancePercent) damage *= 2;
      dispatch(addLogEntry({ type: "combat_hit", enemyName: enemy.name, damage }));
      setLastDamageToEnemy(damage);
      let newHealth = enemy.health - damage;
      if (bonuses.aoeChancePercent > 0 && Math.random() * 100 < bonuses.aoeChancePercent) {
        const extra = Math.floor(damage * 0.5);
        newHealth -= extra;
        damage += extra;
      }
      setCurrentEnemy({ ...enemy, health: newHealth });
      if (newHealth <= 0) {
        dispatch(addLogEntry({ type: "enemy_killed", enemyName: enemy.name }));
        if (area) dispatch(recordEnemyKill(area));
        const sectId = combatContextRef.current.currentSectId;
        if (sectId != null) dispatch(incrementSectQuestKillCount(sectId));
        setLastDamageToEnemy(null);
        const spiritStones = Math.floor(getSpiritStonesFromEnemy(enemy) * talentSpiritStoneMultRef.current);
        if (combatContextRef.current.autoLoot) {
          dispatch(addMoney(spiritStones));
          const droppedItem = rollOneLootDrop(enemy);
          if (droppedItem) {
            dispatch(addItemById({ itemId: droppedItem.id, amount: droppedItem.quantity ?? 1 }));
            dispatch(addLogEntry({ type: "item_obtained", itemName: droppedItem.name }));
          }
        } else {
          addLootToItemBag(enemy, (item) => dispatch(addLogEntry({ type: "item_obtained", itemName: item.name })));
          setLootSpiritStones((prev) => prev + spiritStones);
        }
        setCurrentEnemy(getRandomEnemy());
        if (bonuses.lifestealPercent > 0 && damage > 0) {
          const heal = Math.floor(damage * (bonuses.lifestealPercent / 100));
          if (heal > 0) {
            setCharacterState((prev) => ({
              ...prev,
              health: Math.min(characterStateRef.current.health + heal, effectiveStats.health),
            }));
          }
        }
      } else {
        if (bonuses.lifestealPercent > 0 && damage > 0) {
          const heal = Math.floor(damage * (bonuses.lifestealPercent / 100));
          if (heal > 0) {
            setCharacterState((prev) => ({
              ...prev,
              health: Math.min(prev.health + heal, effectiveStats.health),
            }));
          }
        }
      }
    } else {
      dispatch(addLogEntry({ type: "combat_miss", enemyName: enemy.name }));
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
      const bonuses = talentBonusesRef.current;
      const maxHp = effectiveStatsRef.current.health;
      let healthAfterTick = charState.health - damage;

      // Auto-eat: consume one vitality food when HP drops at or below threshold (if unlocked and enabled)
      if (healthAfterTick > 0 && combatContextRef.current.autoEatUnlocked && combatContextRef.current.autoEat) {
        const threshold = (combatContextRef.current.autoEatHpPercent ?? 30) / 100 * maxHp;
        if (healthAfterTick <= threshold) {
          const food = combatContextRef.current.items.find(
            (i) => i.effect === "vitality" && i.value != null && (i.quantity ?? 1) > 0
          );
          if (food) {
            dispatch(consumeItems([{ itemId: food.id, amount: 1 }]));
            const heal = food.value ?? 0;
            healthAfterTick = Math.min(maxHp, healthAfterTick + heal);
          }
        }
      }

      setCharacterState((prev) => {
        if (healthAfterTick <= 0) setTimeout(() => handleEscapeRef.current(true), 0);
        return { ...prev, health: healthAfterTick };
      });
      if (bonuses.damageReflectPercent > 0 && damage > 0) {
        const reflected = Math.floor(damage * (bonuses.damageReflectPercent / 100));
        if (reflected > 0) {
          const newEnemyHealth = enemy.health - reflected;
          setCurrentEnemy(newEnemyHealth <= 0 ? getRandomEnemy() : { ...enemy, health: newEnemyHealth });
        }
      }
    }
    lastEnemyAttackRef.current = Date.now();
  };

  const doCharacterAttackRef = useRef(doCharacterAttack);
  const doEnemyAttackRef = useRef(doEnemyAttack);
  const handleEscapeRef = useRef(handleEscapeButton);
  doCharacterAttackRef.current = doCharacterAttack;
  doEnemyAttackRef.current = doEnemyAttack;
  handleEscapeRef.current = handleEscapeButton;

  // Character attack timer (attack speed) and enemy attack timer: no setInterval; driven by timestamp checks in rAF loop below.
  // Progress bars: requestAnimationFrame for visual updates; progress computed from timestamps so rerenders are predictable and less frequent.
  const lastCharProgressRef = useRef(0);
  const lastEnemyProgressRef = useRef(0);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const charElapsed = now - lastCharAttackRef.current;
      const enemyElapsed = now - lastEnemyAttackRef.current;

      if (charElapsed >= fightingInterval) {
        doCharacterAttackRef.current();
      }
      if (enemyElapsed >= ENEMY_ATTACK_INTERVAL_MS) {
        doEnemyAttackRef.current();
      }

      const charProgress = Math.min(100, (charElapsed / fightingInterval) * 100);
      const enemyProgress = Math.min(100, (enemyElapsed / ENEMY_ATTACK_INTERVAL_MS) * 100);
      const charRounded = Math.floor(charProgress * 10) / 10;
      const enemyRounded = Math.floor(enemyProgress * 10) / 10;
      if (charRounded !== lastCharProgressRef.current) {
        lastCharProgressRef.current = charRounded;
        setCharacterProgress(charProgress);
      }
      if (enemyRounded !== lastEnemyProgressRef.current) {
        lastEnemyProgressRef.current = enemyRounded;
        setEnemyProgress(enemyProgress);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [fightingInterval]);

  const enemyLootEntries = useMemo(() => {
    if (!currentEnemy) return [];
    const context = { area, currentSectId, path, sectRankIndex };
    const table = getResolvedLootTable(currentEnemy, context);
    if (!table || !table.items.length) return [];
    const total = table.weight.reduce((a, b) => a + b, 0);
    if (total <= 0) return [];
    return table.items.map((item, i) => ({
      item,
      chancePercent: (table.weight[i] / total) * 100,
      amount: item.quantity ?? 1,
    }));
  }, [currentEnemy, area, currentSectId, path, sectRankIndex]);

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
            <img className="combatContainer__main-img" src={getCharacterImage(gender ?? "Male", "default")} alt="You" />
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
          <EnemyLootPopover
            spiritStoneAmount={getSpiritStonesFromEnemy(currentEnemy)}
            lootEntries={enemyLootEntries}
            ownedTechniqueIds={ownedTechniqueIds}
          />
        </div>
      </div>
      <section className="combatContainer__loot">
        <h4 className="combatContainer__loot-title">
          Loot bag
          {autoLoot && <span className="combatContainer__auto-loot-badge">Auto-Loot: On</span>}
        </h4>
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
