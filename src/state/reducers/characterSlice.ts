/**
 * Character state and reducers. One activity at a time (currentActivity); when switching
 * activity, cast state for other skills is cleared. Cast completion is idempotent by castId:
 * complete*Cast ignores the payload if payload.castId !== state.*CastId.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CultivationPath } from "../../constants/cultivationPath";
import { fishTypes, gatheringLootTypes, oreTypes, SECT_POSITIONS } from "../../constants/data";
import { GEODE_ITEM_ID, GEODE_ITEM, rollGemFromGeode } from "../../constants/gems";
import { getBreakthroughQiRequired, getNextRealm, getStepIndex, getCombatStatsFromRealm, type RealmId } from "../../constants/realmProgression";
import { TALENT_NODES_BY_ID } from "../../constants/talents";
import type { AvatarI } from "../../interfaces/AvatarI";
import Item from "../../interfaces/ItemI";
import type { EquipmentSlot } from "../../types/EquipmentSlot";
import { ALL_EQUIPMENT_SLOTS } from "../../types/EquipmentSlot";
import type { ActivityType } from "../../constants/activities";
import {
  type KarmaBonusId,
  KARMA_BONUSES_BY_ID,
  calculateKarmaEarned,
  REINCARNATION_MIN_STEP,
} from "../../constants/reincarnation";
import {
  AVATAR_CREATE_ORE_AMOUNT,
  AVATAR_CREATE_ORE_ID,
  AVATAR_CREATE_SPIRIT_STONES,
  AVATAR_CREATE_WOOD_AMOUNT,
  AVATAR_CREATE_WOOD_ID,
  AVATAR_TRAIN_QI_PILL_AMOUNT,
  AVATAR_TRAIN_SPIRIT_STONES,
} from "../../constants/avatars";

/** Seconds of meditation required to clear weakened state after death (normal mode). */
export const WEAKENED_MEDITATION_SECONDS = 30;

/** Stat multiplier when weakened (e.g. 0.5 = 50% attack/defense/health). */
export const WEAKENED_STAT_MULTIPLIER = 0.5;

/** Payload for applyOfflineProgress (matches OfflineProgressResult from utils/offlineProgress). */
export interface ApplyOfflineProgressPayload {
  offlineMs: number;
  offlineQi: number;
  offlineSpiritStones: number;
  fishing?: { xp: number; casts: number; items: Item[] };
  mining?: { xp: number; casts: number; items: Item[] };
  gathering?: { xp: number; casts: number; items: Item[] };
}

/** Common optional rare-drop fields shared by skill areas that support rare drops. */
export interface RareDropFields {
  rareDropChancePercent?: number;
  rareDropItemIds?: number[];
}

export interface CurrentFishingArea extends RareDropFields {
  areaId: number;
  fishingXP: number;
  fishingDelay: number;
  fishingLootIds: number[];
}

export interface CurrentMiningArea {
  areaId: number;
  miningXP: number;
  miningDelay: number;
  miningLootId: number;
}

export interface CurrentGatheringArea extends RareDropFields {
  areaId: number;
  gatheringXP: number;
  gatheringDelay: number;
  gatheringLootIds: number[];
}

/** Add or increment an item in an inventory array (Immer-compatible). */
function upsertItem(items: Item[], item: Item, qty = 1) {
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    existing.quantity = (existing.quantity ?? 1) + qty;
  } else {
    items.push({ ...item, quantity: qty });
  }
}

function ensureStats(state: { stats?: CharacterStats }): void {
  if (!state.stats) {
    state.stats = {
      enemiesKilledByArea: {},
      itemsGatheredFishing: 0,
      itemsGatheredMining: 0,
      itemsGatheredGathering: 0,
      totalSpiritStonesEarned: 0,
      totalQiGenerated: 0,
      totalBreakthroughs: 0,
      timePlayedMs: 0,
      highestRealmStep: 0,
      itemsCraftedAlchemy: 0,
      itemsCraftedForging: 0,
      itemsCraftedCooking: 0,
      deaths: 0,
    };
  }
}

interface CharacterState {
  name: string;
  attack: number;
  defense: number;
  health: number;
  money: number;
  miner: number;
  items: Item[];
  fishingXP: number;
  realm: RealmId;
  realmLevel: number;
  qi: number;
  currentActivity: ActivityType;
  equipment: Record<EquipmentSlot, Item | null>;
  /** Righteous vs Demonic; chosen once at game start. Affects sects and cultivation tree. */
  path: CultivationPath | null;
  /** Male or Female; chosen at game start. Affects character portrait (default vs lotus in meditation). */
  gender: "Male" | "Female" | null;
  /** Sect id the character has joined; null if none. Only one sect at a time. */
  currentSectId: number | null;
  /** Rank index inside the sect: 0 = Sect Aspirant, 1 = Outer, 2 = Inner, 3 = Core. Affects sect store availability. */
  sectRankIndex: number;
  /** When set, promotion is in progress; at this timestamp it completes. */
  promotionEndTime: number | null;
  /** Rank index we're promoting to (while promotion in progress). */
  promotionToRankIndex: number | null;
  /** Talent id -> current level (0 = not purchased) */
  talentLevels: Record<number, number>;
  /** Immortals Island: when non-null, character is on expedition until this timestamp (ms) */
  expeditionEndTime: number | null;
  expeditionMissionId: number | null;
  /** Avatars: can be sent on expeditions so main can keep cultivating. Unlock at Nascent Soul. */
  avatars: AvatarI[];
  /** Next id to assign to a new avatar. */
  nextAvatarId: number;
  /** When fishing: area being fished; cleared when activity changes away from fish */
  currentFishingArea: CurrentFishingArea | null;
  /** Current cast progress: start time (ms) and duration (ms); null when no cast in progress */
  fishingCastStartTime: number | null;
  fishingCastDuration: number;
  /** Monotonic id for the current/last fishing cast; completion is ignored unless payload.castId matches (idempotent). */
  fishingCastId: number;
  miningXP: number;
  currentMiningArea: CurrentMiningArea | null;
  miningCastStartTime: number | null;
  miningCastDuration: number;
  /** Monotonic id for the current/last mining cast; completion is ignored unless payload.castId matches (idempotent). */
  miningCastId: number;
  gatheringXP: number;
  currentGatheringArea: CurrentGatheringArea | null;
  gatheringCastStartTime: number | null;
  gatheringCastDuration: number;
  /** Monotonic id for the current/last gathering cast; completion is ignored unless payload.castId matches (idempotent). */
  gatheringCastId: number;
  /** XP for alchemy; backloaded curve, level from total XP; affects pill craft success chance */
  alchemyXP: number;
  /** XP for forging; backloaded curve, level from total XP */
  forgingXP: number;
  /** XP for cooking; backloaded curve, level from total XP */
  cookingXP: number;
  /** Permanent bonus to attack from consumables/shop (effective = realm + equipment + this) */
  bonusAttack: number;
  /** Permanent bonus to defense from consumables/shop */
  bonusDefense: number;
  /** Permanent bonus to max vitality/health from consumables/shop */
  bonusHealth: number;
  /** Current vitality (HP); persists between combats. Capped by effective max (realm + equipment + bonus). */
  currentHealth: number;
  /** Last time the game was active (ms). 0 = never set. Used for offline progress. */
  lastActiveTimestamp: number;
  /** After applying offline progress, summary to show in Welcome Back modal; null after dismiss. */
  lastOfflineSummary: OfflineProgressSummary | null;
  /** Number of times the player has reincarnated. */
  reincarnationCount: number;
  /** Unspent Karma Points (currency for prestige bonuses). */
  karmaPoints: number;
  /** Total Karma Points ever earned (for display). */
  totalKarmaEarned: number;
  /** Purchased levels for each karma bonus. */
  karmaBonusLevels: Partial<Record<KarmaBonusId, number>>;
  /** Whether the player has purchased the Auto-Loot upgrade (persists through reincarnation). */
  autoLootUnlocked: boolean;
  /** When true, combat loot and spirit stones go straight to inventory on kill (persists through reincarnation). */
  autoLoot: boolean;
  /** Death penalty mode: "normal" = weakened state after death until meditation; "casual" = no weakened. */
  deathPenaltyMode: "normal" | "casual";
  /** After death (normal mode): true until player meditates for required seconds. */
  isWeakened: boolean;
  /** Seconds meditated while weakened; when >= WEAKENED_MEDITATION_SECONDS, weakened clears. */
  weakenedMeditationSecondsDone: number;
  /** Lifetime statistics (persisted). */
  stats: CharacterStats;
  /** Toast notifications: master switch and per-type. */
  notificationPrefs: NotificationPrefs;
  /** Volume 0–100 for music and SFX (persisted; actual audio not yet wired). */
  soundVolume: { music: number; sfx: number };
}

export interface NotificationPrefs {
  toastsEnabled: boolean;
  levelUp: boolean;
  rareDrop: boolean;
  achievement: boolean;
  expedition: boolean;
}

export interface CharacterStats {
  /** Enemies killed per area (area display name as key). */
  enemiesKilledByArea: Record<string, number>;
  itemsGatheredFishing: number;
  itemsGatheredMining: number;
  itemsGatheredGathering: number;
  totalSpiritStonesEarned: number;
  totalQiGenerated: number;
  totalBreakthroughs: number;
  timePlayedMs: number;
  /** Highest realm step index reached (getStepIndex). */
  highestRealmStep: number;
  itemsCraftedAlchemy: number;
  itemsCraftedForging: number;
  itemsCraftedCooking: number;
  deaths: number;
}

/** Display-only summary for the Welcome Back modal (no item lists). */
export interface OfflineProgressSummary {
  offlineMs: number;
  offlineQi: number;
  offlineSpiritStones: number;
  fishing?: { xp: number; casts: number; itemCount: number };
  mining?: { xp: number; casts: number; itemCount: number };
  gathering?: { xp: number; casts: number; itemCount: number };
}

const initialEquipment = ALL_EQUIPMENT_SLOTS.reduce(
  (acc, slot) => ({ ...acc, [slot]: null }),
  {} as Record<EquipmentSlot, Item | null>
);

const initialCombatStats = getCombatStatsFromRealm("Mortal", 0);

const initialState: CharacterState = {
  name: "Mortal",
  attack: initialCombatStats.attack,
  defense: initialCombatStats.defense,
  health: initialCombatStats.health,
  money: 500,
  miner: 0,
  items: [],
  fishingXP: 0,
  realm: "Mortal",
  realmLevel: 0,
  qi: 0,
  currentActivity: "none",
  equipment: initialEquipment,
  path: null,
  gender: null,
  currentSectId: null,
  sectRankIndex: 0,
  promotionEndTime: null,
  promotionToRankIndex: null,
  talentLevels: {},
  expeditionEndTime: null,
  expeditionMissionId: null,
  avatars: [],
  nextAvatarId: 1,
  currentFishingArea: null,
  fishingCastStartTime: null,
  fishingCastDuration: 0,
  fishingCastId: 0,
  miningXP: 0,
  currentMiningArea: null,
  miningCastStartTime: null,
  miningCastDuration: 0,
  miningCastId: 0,
  gatheringXP: 0,
  currentGatheringArea: null,
  gatheringCastStartTime: null,
  gatheringCastDuration: 0,
  gatheringCastId: 0,
  alchemyXP: 0,
  forgingXP: 0,
  cookingXP: 0,
  bonusAttack: 0,
  bonusDefense: 0,
  bonusHealth: 0,
  currentHealth: initialCombatStats.health,
  lastActiveTimestamp: 0,
  lastOfflineSummary: null,
  reincarnationCount: 0,
  karmaPoints: 0,
  totalKarmaEarned: 0,
  karmaBonusLevels: {},
  autoLootUnlocked: false,
  autoLoot: false,
  deathPenaltyMode: "normal",
  isWeakened: false,
  weakenedMeditationSecondsDone: 0,
  stats: {
    enemiesKilledByArea: {},
    itemsGatheredFishing: 0,
    itemsGatheredMining: 0,
    itemsGatheredGathering: 0,
    totalSpiritStonesEarned: 0,
    totalQiGenerated: 0,
    totalBreakthroughs: 0,
    timePlayedMs: 0,
    highestRealmStep: 0,
    itemsCraftedAlchemy: 0,
    itemsCraftedForging: 0,
    itemsCraftedCooking: 0,
    deaths: 0,
  },
  notificationPrefs: {
    toastsEnabled: true,
    levelUp: true,
    rareDrop: true,
    achievement: true,
    expedition: true,
  },
  soundVolume: { music: 100, sfx: 100 },
};

export const characterSlice = createSlice({
  name: "character",
  initialState,
  reducers: {
    addAttack: (state, action: PayloadAction<number>) => {
      state.bonusAttack = state.bonusAttack + action.payload;
    },
    reduceAttack: (state, action: PayloadAction<number>) => {
      state.bonusAttack = Math.max(0, state.bonusAttack - action.payload);
    },
    addDefense: (state, action: PayloadAction<number>) => {
      state.bonusDefense = state.bonusDefense + action.payload;
    },
    reduceDefense: (state, action: PayloadAction<number>) => {
      state.bonusDefense = Math.max(0, state.bonusDefense - action.payload);
    },
    addHealth: (state, action: PayloadAction<number>) => {
      state.bonusHealth = state.bonusHealth + action.payload;
    },
    reduceHealth: (state, action: PayloadAction<number>) => {
      state.bonusHealth = Math.max(0, state.bonusHealth - action.payload);
    },
    addMoney: (state, action: PayloadAction<number>) => {
      ensureStats(state);
      state.money = state.money + action.payload;
      state.stats!.totalSpiritStonesEarned += action.payload;
    },
    reduceMoney: (state, action: PayloadAction<number>) => {
      state.money = state.money - action.payload;
    },
    addMiner: (state, action: PayloadAction<number>) => {
      state.miner = state.miner + action.payload;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      upsertItem(state.items, action.payload, action.payload.quantity ?? 1);
    },
    addItems: (state, action: PayloadAction<Item[]>) => {
      action.payload.forEach((item) => upsertItem(state.items, item, item.quantity ?? 1));
    },
    removeItem: (state, action: PayloadAction<Item>) => {
      const { id } = action.payload;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx < 0) return;
      const entry = state.items[idx];
      const qty = entry.quantity ?? 1;
      if (qty <= 1) {
        state.items.splice(idx, 1);
      } else {
        entry.quantity = qty - 1;
      }
    },
    /** Consume multiple items by id and amount. Caller must ensure sufficient quantity. */
    consumeItems: (state, action: PayloadAction<{ itemId: number; amount: number }[]>) => {
      action.payload.forEach(({ itemId, amount }) => {
        const idx = state.items.findIndex((i) => i.id === itemId);
        if (idx < 0) return;
        const entry = state.items[idx];
        const qty = entry.quantity ?? 1;
        if (qty <= amount) {
          state.items.splice(idx, 1);
        } else {
          entry.quantity = qty - amount;
        }
      });
    },
    addAlchemyXP: (state, action: PayloadAction<number>) => {
      state.alchemyXP = state.alchemyXP + action.payload;
    },
    addForgingXP: (state, action: PayloadAction<number>) => {
      state.forgingXP = state.forgingXP + action.payload;
    },
    addCookingXP: (state, action: PayloadAction<number>) => {
      state.cookingXP = state.cookingXP + action.payload;
    },
    /** Open geodes: consume up to `amount` geodes, roll gem from table for each, add gems to inventory. */
    openGeodes: (state, action: PayloadAction<number>) => {
      const amount = Math.max(0, Math.floor(action.payload));
      if (amount <= 0) return;
      const geodeEntry = state.items.find((i) => i.id === GEODE_ITEM_ID);
      const have = geodeEntry ? (geodeEntry.quantity ?? 1) : 0;
      const toOpen = Math.min(amount, have);
      if (toOpen <= 0) return;
      if (geodeEntry) {
        const qty = (geodeEntry.quantity ?? 1) - toOpen;
        if (qty <= 0) state.items.splice(state.items.indexOf(geodeEntry), 1);
        else geodeEntry.quantity = qty;
      }
      for (let i = 0; i < toOpen; i++) {
        upsertItem(state.items, rollGemFromGeode());
      }
    },
    addFishingXP: (state, action: PayloadAction<number>) => {
      state.fishingXP = state.fishingXP + action.payload;
    },
    addQi: (state, action: PayloadAction<number>) => {
      ensureStats(state);
      state.qi = Math.round((state.qi + action.payload) * 100) / 100;
      state.stats!.totalQiGenerated += action.payload;
    },
    setQi: (state, action: PayloadAction<number>) => {
      state.qi = action.payload;
    },
    setRealm: (state, action: PayloadAction<{ realm: RealmId; realmLevel: number }>) => {
      state.realm = action.payload.realm;
      state.realmLevel = action.payload.realmLevel;
      const stats = getCombatStatsFromRealm(action.payload.realm, action.payload.realmLevel);
      state.attack = stats.attack;
      state.defense = stats.defense;
      state.health = stats.health;
      state.currentHealth = stats.health;
    },
    breakthrough: (state) => {
      const next = getNextRealm(state.realm, state.realmLevel);
      if (next) {
        ensureStats(state);
        const requiredQi = getBreakthroughQiRequired(state.realm, state.realmLevel);
        state.qi = Math.max(0, Math.round((state.qi - requiredQi) * 100) / 100);
        state.realm = next.realmId;
        state.realmLevel = next.realmLevel;
        const stats = getCombatStatsFromRealm(next.realmId, next.realmLevel);
        state.attack = stats.attack;
        state.defense = stats.defense;
        state.health = stats.health;
        state.currentHealth = stats.health;
        state.stats!.totalBreakthroughs += 1;
        const step = getStepIndex(next.realmId, next.realmLevel);
        if (step > state.stats!.highestRealmStep) state.stats!.highestRealmStep = step;
      }
    },
    setCurrentHealth: (state, action: PayloadAction<number>) => {
      state.currentHealth = Math.max(0, action.payload);
    },
    regenerateVitality: (state, action: PayloadAction<{ amount: number; maxHealth: number }>) => {
      const { amount, maxHealth } = action.payload;
      state.currentHealth = Math.min(maxHealth, state.currentHealth + amount);
    },
    setCurrentActivity: (state, action: PayloadAction<ActivityType>) => {
      state.currentActivity = action.payload;
      if (action.payload !== "fish") {
        state.currentFishingArea = null;
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
      if (action.payload !== "mine") {
        state.currentMiningArea = null;
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
      if (action.payload !== "gather") {
        state.currentGatheringArea = null;
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
    },
    setCurrentFishingArea: (state, action: PayloadAction<CurrentFishingArea | null>) => {
      state.currentFishingArea = action.payload;
      if (!action.payload) {
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
    },
    setFishingCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.fishingCastStartTime = action.payload.startTime;
      state.fishingCastDuration = action.payload.duration;
      state.fishingCastId = action.payload.castId;
    },
    /** Completion is idempotent: ignored entirely if payload.castId !== state.fishingCastId (stale/duplicate timeout). */
    completeFishingCast: (
      state,
      action: PayloadAction<{
        castId: number;
        fishingXP: number;
        fishingLootIds: number[];
        rareDropItem?: Item | null;
        skillingSetDropItem?: Item | null;
      }>
    ) => {
      if (action.payload.castId !== state.fishingCastId) return;
      state.fishingCastStartTime = null;
      state.fishingCastDuration = 0;
      if (state.currentActivity !== "fish" || !state.currentFishingArea) return;
      const { fishingXP, fishingLootIds, rareDropItem } = action.payload;
      state.fishingXP += fishingXP;
      const randomId = fishingLootIds[Math.floor(Math.random() * fishingLootIds.length)];
      const fish = fishTypes.find((f) => f.id === randomId);
      if (fish) upsertItem(state.items, fish);
      if (rareDropItem) upsertItem(state.items, rareDropItem);
      if (action.payload.skillingSetDropItem) {
        const piece = action.payload.skillingSetDropItem;
        const inItems = state.items.some((i) => i.id === piece.id);
        const inEquip = (["helmet", "body", "legs", "shoes"] as const).some(
          (s) => state.equipment[s]?.id === piece.id
        );
        if (!inItems && !inEquip) state.items.push({ ...piece, quantity: 1 });
      }
      ensureStats(state);
      state.stats!.itemsGatheredFishing += 1 + (action.payload.rareDropItem ? 1 : 0) + (action.payload.skillingSetDropItem ? 1 : 0);
    },
    setCurrentMiningArea: (state, action: PayloadAction<CurrentMiningArea | null>) => {
      state.currentMiningArea = action.payload;
      if (!action.payload) {
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
    },
    setMiningCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.miningCastStartTime = action.payload.startTime;
      state.miningCastDuration = action.payload.duration;
      state.miningCastId = action.payload.castId;
    },
    /** Completion is idempotent: ignored entirely if payload.castId !== state.miningCastId (stale/duplicate timeout). */
    completeMiningCast: (
      state,
      action: PayloadAction<{ castId: number; miningXP: number; miningLootId: number; geodeDropped?: boolean; skillingSetDropItem?: Item | null }>
    ) => {
      if (action.payload.castId !== state.miningCastId) return;
      state.miningCastStartTime = null;
      state.miningCastDuration = 0;
      if (state.currentActivity !== "mine" || !state.currentMiningArea) return;
      const { miningXP, miningLootId, geodeDropped } = action.payload;
      state.miningXP += miningXP;
      const ore = oreTypes.find((o) => o.id === miningLootId);
      if (ore) upsertItem(state.items, ore);
      if (geodeDropped) upsertItem(state.items, GEODE_ITEM);
      if (action.payload.skillingSetDropItem) {
        const piece = action.payload.skillingSetDropItem;
        const inItems = state.items.some((i) => i.id === piece.id);
        const inEquip = (["helmet", "body", "legs", "shoes"] as const).some(
          (s) => state.equipment[s]?.id === piece.id
        );
        if (!inItems && !inEquip) state.items.push({ ...piece, quantity: 1 });
      }
      ensureStats(state);
      state.stats!.itemsGatheredMining += 1 + (action.payload.geodeDropped ? 1 : 0) + (action.payload.skillingSetDropItem ? 1 : 0);
    },
    setCurrentGatheringArea: (state, action: PayloadAction<CurrentGatheringArea | null>) => {
      state.currentGatheringArea = action.payload;
      if (!action.payload) {
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
    },
    setGatheringCast: (
      state,
      action: PayloadAction<{ startTime: number; duration: number; castId: number }>
    ) => {
      state.gatheringCastStartTime = action.payload.startTime;
      state.gatheringCastDuration = action.payload.duration;
      state.gatheringCastId = action.payload.castId;
    },
    /** Completion is idempotent: ignored entirely if payload.castId !== state.gatheringCastId (stale/duplicate timeout). */
    completeGatheringCast: (
      state,
      action: PayloadAction<{
        castId: number;
        gatheringXP: number;
        gatheringLootIds: number[];
        rareDropItem?: Item | null;
        skillingSetDropItem?: Item | null;
      }>
    ) => {
      if (action.payload.castId !== state.gatheringCastId) return;
      state.gatheringCastStartTime = null;
      state.gatheringCastDuration = 0;
      if (state.currentActivity !== "gather" || !state.currentGatheringArea) return;
      const { gatheringXP, gatheringLootIds, rareDropItem } = action.payload;
      state.gatheringXP += gatheringXP;
      const randomId = gatheringLootIds[Math.floor(Math.random() * gatheringLootIds.length)];
      const loot = gatheringLootTypes.find((l) => l.id === randomId);
      if (loot) upsertItem(state.items, loot);
      if (rareDropItem) upsertItem(state.items, rareDropItem);
      if (action.payload.skillingSetDropItem) {
        const piece = action.payload.skillingSetDropItem;
        const inItems = state.items.some((i) => i.id === piece.id);
        const inEquip = (["helmet", "body", "legs", "shoes"] as const).some(
          (s) => state.equipment[s]?.id === piece.id
        );
        if (!inItems && !inEquip) state.items.push({ ...piece, quantity: 1 });
      }
      ensureStats(state);
      state.stats!.itemsGatheredGathering += 1 + (action.payload.rareDropItem ? 1 : 0) + (action.payload.skillingSetDropItem ? 1 : 0);
    },
    equipItem: (state, action: PayloadAction<{ slot: EquipmentSlot; item: Item }>) => {
      const { slot, item } = action.payload;
      const existing = state.equipment[slot];
      if (existing) {
        const existingInBag = state.items.find((i) => i.id === existing.id);
        if (existingInBag) {
          existingInBag.quantity = (existingInBag.quantity ?? 1) + 1;
        } else {
          state.items.push({ ...existing, quantity: 1 });
        }
      }
      state.equipment[slot] = item;
      const idx = state.items.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const entry = state.items[idx];
        const qty = entry.quantity ?? 1;
        if (qty <= 1) {
          state.items.splice(idx, 1);
        } else {
          entry.quantity = qty - 1;
        }
      }
    },
    unequipItem: (state, action: PayloadAction<EquipmentSlot>) => {
      const item = state.equipment[action.payload];
      if (item) {
        upsertItem(state.items, item);
        state.equipment[action.payload] = null;
      }
    },
    setPath: (state, action: PayloadAction<CultivationPath>) => {
      state.path = action.payload;
    },
    setGender: (state, action: PayloadAction<"Male" | "Female">) => {
      state.gender = action.payload;
    },
    setSect: (state, action: PayloadAction<number | null>) => {
      state.currentSectId = action.payload;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
      if (action.payload == null) {
        state.sectRankIndex = 0;
        return;
      }
      const step = getStepIndex(state.realm, state.realmLevel);
      let rank = 0;
      for (let i = 0; i < SECT_POSITIONS.length; i++) {
        if (step >= SECT_POSITIONS[i].requiredStepIndex) rank = i;
      }
      state.sectRankIndex = rank;
    },
    setSectRank: (state, action: PayloadAction<number>) => {
      state.sectRankIndex = Math.max(0, Math.min(3, action.payload));
    },
    startPromotion: (
      state,
      action: PayloadAction<{ targetRankIndex: number; durationMs: number }>
    ) => {
      state.promotionEndTime = Date.now() + action.payload.durationMs;
      state.promotionToRankIndex = action.payload.targetRankIndex;
    },
    completePromotion: (state) => {
      if (state.promotionEndTime == null || state.promotionToRankIndex == null) return;
      if (Date.now() < state.promotionEndTime) return;
      const step = getStepIndex(state.realm, state.realmLevel);
      const required = SECT_POSITIONS[state.promotionToRankIndex].requiredStepIndex;
      if (step >= required) state.sectRankIndex = state.promotionToRankIndex;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    },
    cancelPromotion: (state) => {
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
    },
    startExpedition: (
      state,
      action: PayloadAction<
        | { endTime: number; missionId: number; entityType: "main" }
        | { endTime: number; missionId: number; entityType: "avatar"; avatarId: number }
      >
    ) => {
      const payload = action.payload;
      if (payload.entityType === "main") {
        state.expeditionEndTime = payload.endTime;
        state.expeditionMissionId = payload.missionId;
        state.currentActivity = "expedition";
      } else {
        const avatar = state.avatars.find((a) => a.id === payload.avatarId);
        if (avatar) {
          avatar.isBusy = true;
          avatar.expeditionEndTime = payload.endTime;
          avatar.expeditionMissionId = payload.missionId;
        }
      }
    },
    clearExpedition: (
      state,
      action: PayloadAction<{ entityType: "main" } | { entityType: "avatar"; avatarId: number }>
    ) => {
      const payload = action.payload;
      if (payload.entityType === "main") {
        state.expeditionEndTime = null;
        state.expeditionMissionId = null;
        if (state.currentActivity === "expedition") state.currentActivity = "none";
      } else {
        const avatar = state.avatars.find((a) => a.id === payload.avatarId);
        if (avatar) {
          avatar.isBusy = false;
          avatar.expeditionEndTime = null;
          avatar.expeditionMissionId = null;
        }
      }
    },
    createAvatar: (state, action: PayloadAction<{ name: string }>) => {
      if (state.money < AVATAR_CREATE_SPIRIT_STONES) return;
      const oreEntry = state.items.find((i) => i.id === AVATAR_CREATE_ORE_ID);
      const oreQty = oreEntry?.quantity ?? 0;
      if (oreQty < AVATAR_CREATE_ORE_AMOUNT) return;
      const woodEntry = state.items.find((i) => i.id === AVATAR_CREATE_WOOD_ID);
      const woodQty = woodEntry?.quantity ?? 0;
      if (woodQty < AVATAR_CREATE_WOOD_AMOUNT) return;
      state.money -= AVATAR_CREATE_SPIRIT_STONES;
      if (oreEntry) {
        oreEntry.quantity = oreEntry.quantity - AVATAR_CREATE_ORE_AMOUNT;
        if (oreEntry.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== AVATAR_CREATE_ORE_ID);
        }
      }
      if (woodEntry) {
        woodEntry.quantity = woodEntry.quantity - AVATAR_CREATE_WOOD_AMOUNT;
        if (woodEntry.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== AVATAR_CREATE_WOOD_ID);
        }
      }
      const id = state.nextAvatarId++;
      state.avatars.push({
        id,
        name: action.payload.name || `Avatar ${state.avatars.length + 1}`,
        power: 1,
        isBusy: false,
        expeditionEndTime: null,
        expeditionMissionId: null,
      });
    },
    trainAvatar: (
      state,
      action: PayloadAction<
        | { avatarId: number; costType: "spiritStones" }
        | { avatarId: number; costType: "qiPill"; itemId: number }
      >
    ) => {
      const avatar = state.avatars.find((a) => a.id === action.payload.avatarId);
      if (!avatar || avatar.isBusy) return;
      if (action.payload.costType === "spiritStones") {
        if (state.money < AVATAR_TRAIN_SPIRIT_STONES) return;
        state.money -= AVATAR_TRAIN_SPIRIT_STONES;
        avatar.power += 1;
      } else {
        const { itemId } = action.payload;
        const entry = state.items.find((i) => i.id === itemId);
        if (!entry || entry.effect !== "qi") return;
        const qty = entry.quantity ?? 1;
        if (qty < AVATAR_TRAIN_QI_PILL_AMOUNT) return;
        if (qty <= AVATAR_TRAIN_QI_PILL_AMOUNT) {
          state.items = state.items.filter((i) => i.id !== itemId);
        } else {
          entry.quantity = qty - AVATAR_TRAIN_QI_PILL_AMOUNT;
        }
        avatar.power += 1;
      }
    },
    purchaseTalentLevel: (state, action: PayloadAction<number>) => {
      const node = TALENT_NODES_BY_ID[action.payload];
      if (!node) return;
      if (node.path != null && state.path !== node.path) return;
      const currentLevel = state.talentLevels[node.id] ?? 0;
      if (currentLevel >= node.maxLevel) return;
      if (state.qi < node.costQi) return;
      if (node.requiredRealm) {
        const charStep = getStepIndex(state.realm, state.realmLevel);
        const reqStep = getStepIndex(node.requiredRealm.realmId, node.requiredRealm.realmLevel);
        if (charStep < reqStep) return;
      }
      if (node.requiredTalentIds?.length) {
        const allMet = node.requiredTalentIds.every((id) => {
          const reqNode = TALENT_NODES_BY_ID[id];
          return reqNode && (state.talentLevels[id] ?? 0) >= reqNode.maxLevel;
        });
        if (!allMet) return;
      }
      state.qi = Math.round((state.qi - node.costQi) * 100) / 100;
      state.talentLevels[node.id] = currentLevel + 1;
    },
    setLastActiveTimestamp: (state, action: PayloadAction<number>) => {
      ensureStats(state);
      if (state.lastActiveTimestamp > 0) {
        state.stats!.timePlayedMs += Math.max(0, action.payload - state.lastActiveTimestamp);
      }
      state.lastActiveTimestamp = action.payload;
    },
    applyOfflineProgress: (state, action: PayloadAction<ApplyOfflineProgressPayload>) => {
      const p = action.payload;
      state.qi = Math.round((state.qi + p.offlineQi) * 100) / 100;
      state.money += Math.floor(p.offlineSpiritStones);
      if (p.fishing) {
        state.fishingXP += p.fishing.xp;
        p.fishing.items.forEach((item) => upsertItem(state.items, item, item.quantity ?? 1));
        state.fishingCastStartTime = null;
        state.fishingCastDuration = 0;
      }
      if (p.mining) {
        state.miningXP += p.mining.xp;
        p.mining.items.forEach((item) => upsertItem(state.items, item, item.quantity ?? 1));
        state.miningCastStartTime = null;
        state.miningCastDuration = 0;
      }
      if (p.gathering) {
        state.gatheringXP += p.gathering.xp;
        p.gathering.items.forEach((item) => upsertItem(state.items, item, item.quantity ?? 1));
        state.gatheringCastStartTime = null;
        state.gatheringCastDuration = 0;
      }
      state.lastActiveTimestamp = Date.now();
      state.lastOfflineSummary = {
        offlineMs: p.offlineMs,
        offlineQi: p.offlineQi,
        offlineSpiritStones: p.offlineSpiritStones,
        ...(p.fishing && {
          fishing: {
            xp: p.fishing.xp,
            casts: p.fishing.casts,
            itemCount: p.fishing.items.length,
          },
        }),
        ...(p.mining && {
          mining: {
            xp: p.mining.xp,
            casts: p.mining.casts,
            itemCount: p.mining.items.length,
          },
        }),
        ...(p.gathering && {
          gathering: {
            xp: p.gathering.xp,
            casts: p.gathering.casts,
            itemCount: p.gathering.items.length,
          },
        }),
      };
    },
    clearOfflineSummary: (state) => {
      state.lastOfflineSummary = null;
    },
    /**
     * Reincarnate: reset most progress, earn Karma Points based on realm + skill levels.
     * Preserves: path, gender, reincarnation stats, karma bonuses, and unique items
     * (techniques, skilling set pieces, rings, amulets).
     */
    reincarnate: (state, action: PayloadAction<{ karmaEarned: number }>) => {
      const step = getStepIndex(state.realm, state.realmLevel);
      if (step < REINCARNATION_MIN_STEP) return;

      const startingMoneyLevel = state.karmaBonusLevels.startingMoney ?? 0;
      const startingMoneyBonus = startingMoneyLevel * (KARMA_BONUSES_BY_ID.startingMoney?.valuePerLevel ?? 0);

      const isUniqueItem = (item: Item): boolean =>
        item.equipmentSlot === "qiTechnique" ||
        item.equipmentSlot === "combatTechnique" ||
        item.equipmentSlot === "ring" ||
        item.equipmentSlot === "amulet" ||
        item.skillSet != null;

      const preservedItems: Item[] = [];
      const seenIds = new Set<number>();
      for (const item of state.items) {
        if (isUniqueItem(item) && !seenIds.has(item.id)) {
          preservedItems.push({ ...item, quantity: 1 });
          seenIds.add(item.id);
        }
      }
      for (const slot of ALL_EQUIPMENT_SLOTS) {
        const eq = state.equipment[slot];
        if (eq && isUniqueItem(eq) && !seenIds.has(eq.id)) {
          preservedItems.push({ ...eq, quantity: 1 });
          seenIds.add(eq.id);
        }
      }

      state.reincarnationCount += 1;
      state.karmaPoints += action.payload.karmaEarned;
      state.totalKarmaEarned += action.payload.karmaEarned;

      const stats = getCombatStatsFromRealm("Mortal", 0);
      state.name = "Mortal";
      state.realm = "Mortal";
      state.realmLevel = 0;
      state.attack = stats.attack;
      state.defense = stats.defense;
      state.health = stats.health;
      state.currentHealth = stats.health;
      state.qi = 0;
      state.money = 500 + startingMoneyBonus;
      state.miner = 0;
      state.items = preservedItems;
      state.equipment = ALL_EQUIPMENT_SLOTS.reduce(
        (acc, slot) => ({ ...acc, [slot]: null }),
        {} as Record<EquipmentSlot, Item | null>
      );
      state.fishingXP = 0;
      state.miningXP = 0;
      state.gatheringXP = 0;
      state.alchemyXP = 0;
      state.forgingXP = 0;
      state.cookingXP = 0;
      state.bonusAttack = 0;
      state.bonusDefense = 0;
      state.bonusHealth = 0;
      state.talentLevels = {};
      state.currentSectId = null;
      state.sectRankIndex = 0;
      state.promotionEndTime = null;
      state.promotionToRankIndex = null;
      state.avatars = [];
      state.nextAvatarId = 1;
      state.expeditionEndTime = null;
      state.expeditionMissionId = null;
      state.currentActivity = "none";
      state.currentFishingArea = null;
      state.fishingCastStartTime = null;
      state.fishingCastDuration = 0;
      state.fishingCastId = 0;
      state.currentMiningArea = null;
      state.miningCastStartTime = null;
      state.miningCastDuration = 0;
      state.miningCastId = 0;
      state.currentGatheringArea = null;
      state.gatheringCastStartTime = null;
      state.gatheringCastDuration = 0;
      state.gatheringCastId = 0;
      state.lastActiveTimestamp = Date.now();
      state.lastOfflineSummary = null;
      state.isWeakened = false;
      state.weakenedMeditationSecondsDone = 0;
    },
    purchaseKarmaBonus: (state, action: PayloadAction<KarmaBonusId>) => {
      const bonus = KARMA_BONUSES_BY_ID[action.payload];
      if (!bonus) return;
      const currentLevel = state.karmaBonusLevels[action.payload] ?? 0;
      if (currentLevel >= bonus.maxLevel) return;
      if (state.karmaPoints < bonus.costPerLevel) return;
      state.karmaPoints -= bonus.costPerLevel;
      state.karmaBonusLevels[action.payload] = currentLevel + 1;
    },
    /** One-time purchase: unlock Auto-Loot for 500 spirit stones. Persists through reincarnation. */
    purchaseAutoLootUnlock: (state) => {
      if (state.autoLootUnlocked) return;
      if (state.money < 500) return;
      state.money -= 500;
      state.autoLootUnlocked = true;
      state.autoLoot = true;
    },
    /** Toggle Auto-Loot on/off (only when unlocked). Persists through reincarnation. */
    setAutoLoot: (state, action: PayloadAction<boolean>) => {
      if (!state.autoLootUnlocked) return;
      state.autoLoot = action.payload;
    },
    /** Death penalty: "normal" = weakened after death; "casual" = no weakened. */
    setDeathPenaltyMode: (state, action: PayloadAction<"normal" | "casual">) => {
      state.deathPenaltyMode = action.payload;
      if (action.payload === "casual") {
        state.isWeakened = false;
        state.weakenedMeditationSecondsDone = 0;
      }
    },
    /** Set weakened state (e.g. on death in normal mode). */
    setWeakened: (state, action: PayloadAction<boolean>) => {
      state.isWeakened = action.payload;
      if (!action.payload) state.weakenedMeditationSecondsDone = 0;
    },
    /** While meditating and weakened, call every second; clears weakened when done. */
    tickWeakenedRecovery: (state, action: PayloadAction<number>) => {
      if (!state.isWeakened || state.deathPenaltyMode !== "normal") return;
      state.weakenedMeditationSecondsDone += action.payload;
      if (state.weakenedMeditationSecondsDone >= WEAKENED_MEDITATION_SECONDS) {
        state.isWeakened = false;
        state.weakenedMeditationSecondsDone = 0;
      }
    },
    recordEnemyKill: (state, action: PayloadAction<string>) => {
      ensureStats(state);
      const area = action.payload;
      state.stats!.enemiesKilledByArea[area] = (state.stats!.enemiesKilledByArea[area] ?? 0) + 1;
    },
    recordDeath: (state) => {
      ensureStats(state);
      state.stats!.deaths += 1;
    },
    recordItemCrafted: (state, action: PayloadAction<"alchemy" | "forging" | "cooking">) => {
      ensureStats(state);
      if (action.payload === "alchemy") state.stats!.itemsCraftedAlchemy += 1;
      else if (action.payload === "forging") state.stats!.itemsCraftedForging += 1;
      else state.stats!.itemsCraftedCooking += 1;
    },
    setNotificationPrefs: (state, action: PayloadAction<Partial<NotificationPrefs>>) => {
      if (!state.notificationPrefs) state.notificationPrefs = { toastsEnabled: true, levelUp: true, rareDrop: true, achievement: true, expedition: true };
      Object.assign(state.notificationPrefs, action.payload);
    },
    setSoundVolume: (state, action: PayloadAction<{ music?: number; sfx?: number }>) => {
      if (!state.soundVolume) state.soundVolume = { music: 100, sfx: 100 };
      if (action.payload.music != null) state.soundVolume.music = Math.max(0, Math.min(100, action.payload.music));
      if (action.payload.sfx != null) state.soundVolume.sfx = Math.max(0, Math.min(100, action.payload.sfx));
    },
  },
});

export const {
  addAttack,
  reduceAttack,
  addDefense,
  reduceDefense,
  addHealth,
  reduceHealth,
  addMoney,
  reduceMoney,
  addMiner,
  addItem,
  addItems,
  removeItem,
  consumeItems,
  addAlchemyXP,
  addForgingXP,
  addCookingXP,
  openGeodes,
  addFishingXP,
  addQi,
  setQi,
  setRealm,
  breakthrough,
  setCurrentHealth,
  regenerateVitality,
  setCurrentActivity,
  setCurrentFishingArea,
  setFishingCast,
  completeFishingCast,
  setCurrentMiningArea,
  setMiningCast,
  completeMiningCast,
  setCurrentGatheringArea,
  setGatheringCast,
  completeGatheringCast,
  equipItem,
  unequipItem,
  setPath,
  setGender,
  setSect,
  setSectRank,
  startPromotion,
  completePromotion,
  cancelPromotion,
  startExpedition,
  clearExpedition,
  createAvatar,
  trainAvatar,
  purchaseTalentLevel,
  setLastActiveTimestamp,
  applyOfflineProgress,
  clearOfflineSummary,
  reincarnate,
  purchaseKarmaBonus,
  purchaseAutoLootUnlock,
  setAutoLoot,
  setDeathPenaltyMode,
  setWeakened,
  tickWeakenedRecovery,
  recordEnemyKill,
  recordDeath,
  recordItemCrafted,
  setNotificationPrefs,
  setSoundVolume,
} = characterSlice.actions;

export default characterSlice.reducer;
