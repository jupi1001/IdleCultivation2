/**
 * Combat engine hook: attack intervals, damage calculation, enemy/character state,
 * loot roll, auto-eat, death handling. Uses combatMath and combatLoot.
 * Container uses this and renders JSX only.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ENEMIES_BY_ID, ITEMS_BY_ID } from "../constants/data";
import { ContentArea } from "../enum/ContentArea";
import EnemyI from "../interfaces/EnemyI";
import Item, { getConsumableEffect } from "../interfaces/ItemI";
import { addMoney } from "../state/reducers/characterCoreSlice";
import { setCurrentHealth, setWeakened } from "../state/reducers/combatSlice";
import { changeContent, routeFromArea } from "../state/reducers/contentSlice";
import { addItemById, addItemsById, consumeItems } from "../state/reducers/inventorySlice";
import { addLogEntry } from "../state/reducers/logSlice";
import { incrementSectQuestKillCount } from "../state/reducers/sectSlice";
import { recordEnemyKill, recordDeath } from "../state/reducers/statsSlice";
import {
  getEffectiveCombatStats,
  getOwnedTechniqueIds,
  getTalentSpiritStoneMultiplier,
  selectCurrentHealth,
  selectItemsById,
  selectDeathPenaltyMode,
  selectCurrentSectId,
  selectPath,
  selectSectRankIndex,
  selectAutoLoot,
  selectAutoEatUnlocked,
  selectAutoEat,
  selectAutoEatHpPercent,
  selectGender,
} from "../state/selectors/characterSelectors";
import { isConsumableItem } from "../types/itemGuards";
import { getResolvedLootTable, getEnemyLootEntries, rollOneDrop } from "../utils/combatLoot";
import { doesHit, computeBaseDamage } from "../utils/combatMath";

const ENEMY_ATTACK_INTERVAL_MS = 3000;
const BASE_ATTACK_INTERVAL_MS = 2000;
const MIN_ATTACK_INTERVAL_MS = 500;

export interface UseCombatEngineResult {
  characterState: { attack: number; defense: number; health: number; [k: string]: unknown };
  currentEnemy: EnemyI | undefined;
  enemyMaxHealth: number;
  characterProgress: number;
  enemyProgress: number;
  itemBag: Item[];
  lootSpiritStones: number;
  lastDamageToEnemy: number | null;
  lastDamageToCharacter: number | null;
  vitalityFood: (Item & { quantity: number })[];
  enemyLootEntries: ReturnType<typeof getEnemyLootEntries>;
  fightingInterval: number;
  effectiveStats: ReturnType<typeof getEffectiveCombatStats>;
  ownedTechniqueIds: Set<number>;
  autoLoot: boolean;
  gender: "Male" | "Female" | undefined;
  handleEscapeButton: (died: boolean) => void;
  handleLootButton: () => void;
  useVitalityFood: (item: Item) => void;
  getSpiritStonesFromEnemy: (enemy: EnemyI) => number;
}

export function useCombatEngine(area: string | undefined): UseCombatEngineResult | null {
  const dispatch = useDispatch();
  const currentHealth = useSelector(selectCurrentHealth);
  const itemsById = useSelector(selectItemsById);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const currentSectId = useSelector(selectCurrentSectId);
  const path = useSelector(selectPath);
  const sectRankIndex = useSelector(selectSectRankIndex);
  const autoLoot = useSelector(selectAutoLoot);
  const autoEatUnlocked = useSelector(selectAutoEatUnlocked);
  const autoEat = useSelector(selectAutoEat);
  const autoEatHpPercent = useSelector(selectAutoEatHpPercent);
  const effectiveStats = useSelector(getEffectiveCombatStats);
  const ownedTechniqueIds = useSelector(getOwnedTechniqueIds);
  const talentSpiritStoneMult = useSelector(getTalentSpiritStoneMultiplier);
  const gender = useSelector(selectGender);

  const currentEnemies = useMemo(
    () => (area ? Object.values(ENEMIES_BY_ID).filter((e) => e.location.toString() === area) : []),
    [area]
  );
  const getRandomEnemy = useCallback((): EnemyI | undefined => {
    if (currentEnemies.length === 0) return undefined;
    return currentEnemies[Math.floor(Math.random() * currentEnemies.length)];
  }, [currentEnemies]);

  const [characterState, setCharacterState] = useState(() => ({
    ...effectiveStats,
    health: Math.min(effectiveStats.health, currentHealth),
  }));
  const [currentEnemy, setCurrentEnemy] = useState<EnemyI | undefined>(() => getRandomEnemy());
  const [itemBag, setItemBag] = useState<Item[]>([]);
  const [lootSpiritStones, setLootSpiritStones] = useState(0);
  const [lastDamageToEnemy, setLastDamageToEnemy] = useState<number | null>(null);
  const [lastDamageToCharacter, setLastDamageToCharacter] = useState<number | null>(null);
  const [characterProgress, setCharacterProgress] = useState(0);
  const [enemyProgress, setEnemyProgress] = useState(0);

  useEffect(() => {
    setCharacterState((prev) => ({ ...effectiveStats, health: Math.min(prev.health, effectiveStats.health) }));
  }, [effectiveStats.attack, effectiveStats.defense, effectiveStats.health]);
  useEffect(() => {
    setCharacterState((prev) => ({ ...prev, health: Math.min(effectiveStats.health, currentHealth) }));
  }, [currentHealth]);
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

  const fightingInterval = Math.max(
    MIN_ATTACK_INTERVAL_MS,
    BASE_ATTACK_INTERVAL_MS - (effectiveStats.attackSpeedReduction ?? 0)
  );
  const enemyMaxHealth = currentEnemy
    ? (ENEMIES_BY_ID[currentEnemy.id]?.health ?? currentEnemy.health)
    : 1;

  const characterStateRef = useRef(characterState);
  const currentEnemyRef = useRef<EnemyI | null>(currentEnemy ?? null);
  const lastCharAttackRef = useRef(Date.now());
  const lastEnemyAttackRef = useRef(Date.now());
  const ownedTechniqueIdsRef = useRef(ownedTechniqueIds);
  const talentSpiritStoneMultRef = useRef(talentSpiritStoneMult);
  const effectiveStatsRef = useRef(effectiveStats);
  const combatContextRef = useRef({
    currentSectId,
    path,
    sectRankIndex,
    itemsById,
    autoLoot,
    autoEatUnlocked,
    autoEat,
    autoEatHpPercent,
  });

  characterStateRef.current = characterState;
  currentEnemyRef.current = currentEnemy ?? null;
  ownedTechniqueIdsRef.current = ownedTechniqueIds;
  talentSpiritStoneMultRef.current = talentSpiritStoneMult;
  effectiveStatsRef.current = effectiveStats;
  combatContextRef.current = {
    currentSectId,
    path,
    sectRankIndex,
    itemsById,
    autoLoot,
    autoEatUnlocked,
    autoEat,
    autoEatHpPercent,
  };

  const getSpiritStonesFromEnemy = useCallback((enemy: EnemyI) => {
    const maxHp = ENEMIES_BY_ID[enemy.id]?.health ?? enemy.health;
    return Math.max(1, 5 + Math.floor(maxHp / 5));
  }, []);

  const rollOneLootDrop = useCallback(
    (enemy: EnemyI): Item | null => {
      const context = { area, currentSectId, path, sectRankIndex };
      const table = getResolvedLootTable(enemy, context);
      return rollOneDrop(table, ownedTechniqueIdsRef.current);
    },
    [area, currentSectId, path, sectRankIndex]
  );

  const addLootToItemBag = useCallback(
    (enemy: EnemyI, onItemDropped?: (item: Item) => void) => {
      const context = { area, currentSectId, path, sectRankIndex };
      const table = getResolvedLootTable(enemy, context);
      const dropped = rollOneDrop(table, ownedTechniqueIdsRef.current);
      if (!dropped) return;
      onItemDropped?.(dropped);
      setItemBag((prev) => [...prev, dropped]);
    },
    [area, currentSectId, path, sectRankIndex]
  );

  const handleLootButton = useCallback(() => {
    if (lootSpiritStones > 0) {
      dispatch(addMoney(lootSpiritStones));
      setLootSpiritStones(0);
    }
    if (itemBag.length > 0) {
      dispatch(addItemsById(itemBag.map((i) => ({ itemId: i.id, amount: i.quantity ?? 1 }))));
      setItemBag([]);
    }
  }, [dispatch, lootSpiritStones, itemBag]);

  const handleEscapeButton = useCallback(
    (died: boolean) => {
      dispatch(setCurrentHealth(died ? 0 : characterState.health));
      if (died) {
        setItemBag([]);
        setLootSpiritStones(0);
        if (deathPenaltyMode === "normal") dispatch(setWeakened(true));
        dispatch(recordDeath());
      } else if (itemBag.length > 0 || lootSpiritStones > 0) {
        if (lootSpiritStones > 0) {
          dispatch(addMoney(lootSpiritStones));
          setLootSpiritStones(0);
        }
        if (itemBag.length > 0) {
          dispatch(addItemsById(itemBag.map((i) => ({ itemId: i.id, amount: i.quantity ?? 1 }))));
          setItemBag([]);
        }
      }
      dispatch(changeContent(routeFromArea(ContentArea.MEDITATION)));
    },
    [dispatch, characterState.health, deathPenaltyMode, itemBag, lootSpiritStones]
  );

  const useVitalityFood = useCallback(
    (item: Item) => {
      const effect = getConsumableEffect(item);
      const heal = effect?.type === "healVitality" ? effect.amount : 0;
      if (heal <= 0) return;
      dispatch(consumeItems([{ itemId: item.id, amount: 1 }]));
      setCharacterState((prev) => ({
        ...prev,
        health: Math.min(effectiveStats.health, prev.health + heal),
      }));
    },
    [dispatch, effectiveStats.health]
  );

  const doCharacterAttack = useCallback(() => {
    const enemy = currentEnemyRef.current;
    const charState = characterStateRef.current;
    if (!enemy) return;
    const bonuses = effectiveStatsRef.current.talentBonuses;

    const hitRoll = Math.random();
    if (!doesHit(charState.attack, enemy.defense, hitRoll)) {
      dispatch(addLogEntry({ type: "combat_miss", enemyName: enemy.name }));
      lastCharAttackRef.current = Date.now();
      return;
    }

    let damage = computeBaseDamage(charState.attack, Math.random());
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
      if (combatContextRef.current.currentSectId != null) {
        dispatch(incrementSectQuestKillCount(combatContextRef.current.currentSectId));
      }
      setLastDamageToEnemy(null);
      const spiritStones = Math.floor(
        getSpiritStonesFromEnemy(enemy) * talentSpiritStoneMultRef.current
      );
      if (combatContextRef.current.autoLoot) {
        dispatch(addMoney(spiritStones));
        const droppedItem = rollOneLootDrop(enemy);
        if (droppedItem) {
          dispatch(addItemById({ itemId: droppedItem.id, amount: droppedItem.quantity ?? 1 }));
          dispatch(addLogEntry({ type: "item_obtained", itemName: droppedItem.name }));
        }
      } else {
        addLootToItemBag(enemy, (item) =>
          dispatch(addLogEntry({ type: "item_obtained", itemName: item.name }))
        );
        setLootSpiritStones((prev) => prev + spiritStones);
      }
      setCurrentEnemy(getRandomEnemy());
      if (bonuses.lifestealPercent > 0 && damage > 0) {
        const heal = Math.floor(damage * (bonuses.lifestealPercent / 100));
        if (heal > 0) {
          setCharacterState((prev) => ({
            ...prev,
            health: Math.min(characterStateRef.current.health + heal, effectiveStatsRef.current.health),
          }));
        }
      }
    } else {
      if (bonuses.lifestealPercent > 0 && damage > 0) {
        const heal = Math.floor(damage * (bonuses.lifestealPercent / 100));
        if (heal > 0) {
          setCharacterState((prev) => ({
            ...prev,
            health: Math.min(prev.health + heal, effectiveStatsRef.current.health),
          }));
        }
      }
    }
    lastCharAttackRef.current = Date.now();
  }, [area, dispatch, getRandomEnemy, getSpiritStonesFromEnemy, rollOneLootDrop, addLootToItemBag]);

  const doEnemyAttack = useCallback(() => {
    const enemy = currentEnemyRef.current;
    const charState = characterStateRef.current;
    if (!enemy) return;
    const bonuses = effectiveStatsRef.current.talentBonuses;
    const maxHp = effectiveStatsRef.current.health;

    const hitRoll = Math.random();
    if (!doesHit(enemy.attack, charState.defense, hitRoll)) {
      lastEnemyAttackRef.current = Date.now();
      return;
    }

    const damage = computeBaseDamage(enemy.attack, Math.random());
    setLastDamageToCharacter(damage);
    let healthAfterTick = charState.health - damage;

    if (
      healthAfterTick > 0 &&
      combatContextRef.current.autoEatUnlocked &&
      combatContextRef.current.autoEat
    ) {
      const threshold =
        ((combatContextRef.current.autoEatHpPercent ?? 30) / 100) * maxHp;
      if (healthAfterTick <= threshold) {
        const itemsByIdRef = combatContextRef.current.itemsById;
        const foodId = Object.keys(itemsByIdRef)
          .map(Number)
          .find(
            (id) => {
              const def = ITEMS_BY_ID[id];
              const effect = def ? getConsumableEffect(def) : null;
              return effect?.type === "healVitality" && (itemsByIdRef[id] ?? 0) > 0;
            }
          );
        if (foodId != null) {
          const food = ITEMS_BY_ID[foodId]!;
          const effect = getConsumableEffect(food);
          const healAmount = effect?.type === "healVitality" ? effect.amount : 0;
          dispatch(consumeItems([{ itemId: food.id, amount: 1 }]));
          healthAfterTick = Math.min(maxHp, healthAfterTick + healAmount);
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
        setCurrentEnemy(
          newEnemyHealth <= 0 ? getRandomEnemy() : { ...enemy, health: newEnemyHealth }
        );
      }
    }
    lastEnemyAttackRef.current = Date.now();
  }, [dispatch, getRandomEnemy]);

  const doCharacterAttackRef = useRef(doCharacterAttack);
  const doEnemyAttackRef = useRef(doEnemyAttack);
  const handleEscapeRef = useRef(handleEscapeButton);
  doCharacterAttackRef.current = doCharacterAttack;
  doEnemyAttackRef.current = doEnemyAttack;
  handleEscapeRef.current = handleEscapeButton;

  const lastCharProgressRef = useRef(0);
  const lastEnemyProgressRef = useRef(0);
  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const now = Date.now();
      const charElapsed = now - lastCharAttackRef.current;
      const enemyElapsed = now - lastEnemyAttackRef.current;
      if (charElapsed >= fightingInterval) doCharacterAttackRef.current();
      if (enemyElapsed >= ENEMY_ATTACK_INTERVAL_MS) doEnemyAttackRef.current();
      const charProg = Math.min(100, (charElapsed / fightingInterval) * 100);
      const enemyProg = Math.min(100, (enemyElapsed / ENEMY_ATTACK_INTERVAL_MS) * 100);
      const charRounded = Math.floor(charProg * 10) / 10;
      const enemyRounded = Math.floor(enemyProg * 10) / 10;
      if (charRounded !== lastCharProgressRef.current) {
        lastCharProgressRef.current = charRounded;
        setCharacterProgress(charProg);
      }
      if (enemyRounded !== lastEnemyProgressRef.current) {
        lastEnemyProgressRef.current = enemyRounded;
        setEnemyProgress(enemyProg);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [fightingInterval]);

  const vitalityFood = useMemo(() => {
    const list: (Item & { quantity: number })[] = [];
    for (const idStr of Object.keys(itemsById)) {
      const id = Number(idStr);
      const qty = itemsById[id] ?? 0;
      if (qty <= 0) continue;
      const def = ITEMS_BY_ID[id];
      const effect = def ? getConsumableEffect(def) : null;
      if (def && isConsumableItem(def) && effect?.type === "healVitality") {
        list.push({ ...def, quantity: qty });
      }
    }
    return list;
  }, [itemsById]);

  const context = useMemo(
    () => ({ area, currentSectId, path, sectRankIndex }),
    [area, currentSectId, path, sectRankIndex]
  );
  const enemyLootEntries = useMemo(
    () => getEnemyLootEntries(currentEnemy, context),
    [currentEnemy, context]
  );

  if (!area || currentEnemies.length === 0) return null;

  return {
    characterState,
    currentEnemy,
    enemyMaxHealth,
    characterProgress,
    enemyProgress,
    itemBag,
    lootSpiritStones,
    lastDamageToEnemy,
    lastDamageToCharacter,
    vitalityFood,
    enemyLootEntries,
    fightingInterval,
    effectiveStats,
    ownedTechniqueIds,
    autoLoot,
    gender: gender ?? undefined,
    handleEscapeButton,
    handleLootButton,
    useVitalityFood,
    getSpiritStonesFromEnemy,
  };
}
