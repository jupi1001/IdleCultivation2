/**
 * Central hook for all background activity progression.
 * Mount this once (in Main) so fishing, meditation, labour, and future
 * activities (mining, gathering, etc.) keep ticking regardless of which
 * view is open. Only expedition is handled elsewhere (it locks the view).
 *
 * One activity at a time; cast completion is idempotent by castId:
 * complete*Cast ignores the payload entirely if payload.castId !== state.*CastId,
 * making stale/duplicate timeouts harmless.
 *
 * Timeout management uses per-skill refs instead of cleanup functions so
 * React Strict Mode double-firing does not create duplicate timers.
 */
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  FISHING_AREA_INDEX_BY_ID,
  GATHERING_AREA_INDEX_BY_ID,
  MINING_AREA_INDEX_BY_ID,
} from "../constants/data";
import { BASE_QI_PER_SECOND } from "../constants/meditation";
import { getRingAmuletItemById } from "../constants/ringsAmulets";
import {
  getSkillingSetItemById,
  getSetPieceIds,
  getTierForFishingAreaIndex,
  getTierForGatheringAreaIndex,
  getTierForMiningAreaIndex,
  SKILLING_SET_DROP_CHANCE_PERCENT,
} from "../constants/skillingSets";
import type Item from "../interfaces/ItemI";
import {
  addMoney,
  addQi,
  completeFishingCast,
  completeGatheringCast,
  completeMiningCast,
  setLastActiveTimestamp,
} from "../state/reducers/characterCoreSlice";
import { tickWeakenedRecovery } from "../state/reducers/combatSlice";
import { setFishingCast, setGatheringCast, setMiningCast } from "../state/reducers/skillsSlice";
import { addToast } from "../state/reducers/toastSlice";
import {
  getSkillSpeedBonusFishing,
  getSkillSpeedBonusMining,
  getSkillSpeedBonusGathering,
  getMiningYieldBonusPercent,
  getOwnedSkillingSetPieceIds,
  getKarmaQiMultiplier,
  getKarmaSkillXpMultiplier,
  getKarmaSpiritStoneMultiplier,
  getTalentQiGainBonus,
  getTalentSpiritStoneMultiplier,
} from "../state/selectors/characterSelectors";
import {
  selectCurrentActivity,
  selectCurrentFishingArea,
  selectFishingCastStartTime,
  selectCurrentMiningArea,
  selectMiningCastStartTime,
  selectCurrentGatheringArea,
  selectGatheringCastStartTime,
  selectEquipment,
  selectMiner,
  selectIsWeakened,
  selectDeathPenaltyMode,
} from "../state/selectors/characterSelectors";
import { useAppDispatch } from "../state/store";
import { getEffectiveDuration, rollMiningLootQuantity } from "../utils/activityTiming";
import { rollOneTimeDrop } from "../utils/oneTimeDrops";

function rollRareDropRingAmulet(
  rareDropChancePercent: number | undefined,
  rareDropItemIds: number[] | undefined
): Item | null {
  if (
    rareDropChancePercent == null ||
    rareDropItemIds == null ||
    rareDropItemIds.length === 0 ||
    Math.random() * 100 >= rareDropChancePercent
  )
    return null;
  const rareId = rareDropItemIds[Math.floor(Math.random() * rareDropItemIds.length)];
  return getRingAmuletItemById(rareId) ?? null;
}

function rollSkillingSetForArea(
  skill: "fishing" | "mining" | "gathering",
  areaId: number,
  areaIndexById: Record<number, number>,
  getTier: (areaIndex: number) => "lesser" | "greater" | "perfected",
  ownedRef: React.MutableRefObject<Set<number>>
): Item | null {
  const areaIndex = areaIndexById[areaId];
  if (areaIndex == null) return null;
  const tier = getTier(areaIndex);
  const pieceIds = getSetPieceIds(skill, tier);
  return rollOneTimeDrop(ownedRef.current, pieceIds, SKILLING_SET_DROP_CHANCE_PERCENT, getSkillingSetItemById);
}

export function useActivityTicks() {
  const dispatch = useAppDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const currentFishingArea = useSelector(selectCurrentFishingArea);
  const fishingCastStartTime = useSelector(selectFishingCastStartTime);
  const currentMiningArea = useSelector(selectCurrentMiningArea);
  const miningCastStartTime = useSelector(selectMiningCastStartTime);
  const currentGatheringArea = useSelector(selectCurrentGatheringArea);
  const gatheringCastStartTime = useSelector(selectGatheringCastStartTime);
  const equipment = useSelector(selectEquipment);
  const miner = useSelector(selectMiner);
  const minerRef = useRef(miner);
  const skillSpeedBonusFishing = useSelector(getSkillSpeedBonusFishing);
  const skillSpeedBonusMining = useSelector(getSkillSpeedBonusMining);
  const skillSpeedBonusGathering = useSelector(getSkillSpeedBonusGathering);
  const miningYieldPercent = useSelector(getMiningYieldBonusPercent);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedSkillingSetRef = useRef<Set<number>>(new Set());
  ownedSkillingSetRef.current = ownedSkillingSetPieceIds;
  const karmaQiMult = useSelector(getKarmaQiMultiplier);
  const karmaXpMult = useSelector(getKarmaSkillXpMultiplier);
  const karmaSsMult = useSelector(getKarmaSpiritStoneMultiplier);
  const talentSsMult = useSelector(getTalentSpiritStoneMultiplier);
  const talentQiGain = useSelector(getTalentQiGainBonus);
  const karmaQiMultRef = useRef(karmaQiMult);
  const isWeakened = useSelector(selectIsWeakened);
  const deathPenaltyMode = useSelector(selectDeathPenaltyMode);
  const karmaXpMultRef = useRef(karmaXpMult);
  const karmaSsMultRef = useRef(karmaSsMult * talentSsMult);
  karmaQiMultRef.current = karmaQiMult;
  karmaXpMultRef.current = karmaXpMult;
  karmaSsMultRef.current = karmaSsMult;

  const nextFishingCastIdRef = useRef(0);
  const nextMiningCastIdRef = useRef(0);
  const nextGatheringCastIdRef = useRef(0);

  const fishingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const miningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gatheringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    karmaSsMultRef.current = karmaSsMult * talentSsMult;
  }, [karmaSsMult, talentSsMult]);

  useEffect(() => {
    minerRef.current = miner;
  }, [miner]);

  // Labour: miners generate spirit stones every second (always on, not tied to activity)
  useEffect(() => {
    const id = setInterval(() => {
      const income = Math.floor(minerRef.current * karmaSsMultRef.current);
      if (income > 0) dispatch(addMoney(income));
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  // Periodically persist last-active into Redux (beforeunload + localStorage is the primary source;
  // this is a fallback for cases where beforeunload doesn't fire, e.g. mobile browsers or crashes).
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(setLastActiveTimestamp(Date.now()));
    }, 30_000);
    return () => clearInterval(id);
  }, [dispatch]);

  // Meditation: +Qi per second while currentActivity === "meditate"; when weakened, tick recovery.
  const baseQiPerSecond =
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique && "qiGainBonus" in equipment.qiTechnique ? equipment.qiTechnique.qiGainBonus ?? 0 : 0) + (equipment.amulet && "qiGainBonus" in equipment.amulet ? equipment.amulet.qiGainBonus ?? 0 : 0) + talentQiGain) * 10) / 10;
  const qiPerSecond = Math.round(baseQiPerSecond * karmaQiMult * 100) / 100;
  useEffect(() => {
    if (currentActivity !== "meditate") return;
    const id = setInterval(() => {
      dispatch(addQi(qiPerSecond));
      if (isWeakened) dispatch(tickWeakenedRecovery({ seconds: 1, deathPenaltyMode }));
    }, 1000);
    return () => clearInterval(id);
  }, [currentActivity, dispatch, qiPerSecond, isWeakened, deathPenaltyMode]);

  // ── Fishing ──
  useEffect(() => {
    if (currentActivity !== "fish" || currentFishingArea == null || fishingCastStartTime != null) return;

    if (fishingTimeoutRef.current != null) {
      clearTimeout(fishingTimeoutRef.current);
      fishingTimeoutRef.current = null;
    }

    const area = currentFishingArea;
    const effectiveDuration = getEffectiveDuration(area.delay, skillSpeedBonusFishing);
    const castId = ++nextFishingCastIdRef.current;
    dispatch(setFishingCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    fishingTimeoutRef.current = setTimeout(() => {
      fishingTimeoutRef.current = null;
      const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
      const skillingSetDropItem = rollSkillingSetForArea(
        "fishing", area.areaId, FISHING_AREA_INDEX_BY_ID, getTierForFishingAreaIndex, ownedSkillingSetRef
      );
      dispatch(completeFishingCast({
        castId,
        xp: Math.round(area.xp * karmaXpMultRef.current),
        fishingLootIds: area.fishingLootIds,
        rareDropItem: rareDropItem ?? undefined,
        skillingSetDropItem: skillingSetDropItem ?? undefined,
      }));
      if (rareDropItem) dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
      if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
    }, effectiveDuration);
  }, [currentActivity, currentFishingArea, fishingCastStartTime, dispatch, skillSpeedBonusFishing]);

  // ── Mining ──
  useEffect(() => {
    if (currentActivity !== "mine" || currentMiningArea == null || miningCastStartTime != null) return;

    if (miningTimeoutRef.current != null) {
      clearTimeout(miningTimeoutRef.current);
      miningTimeoutRef.current = null;
    }

    const area = currentMiningArea;
    const effectiveDuration = getEffectiveDuration(area.delay, skillSpeedBonusMining);
    const castId = ++nextMiningCastIdRef.current;
    dispatch(setMiningCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    miningTimeoutRef.current = setTimeout(() => {
      miningTimeoutRef.current = null;
      const geodeDropped = Math.random() * 100 < 3;
      const skillingSetDropItem = rollSkillingSetForArea(
        "mining", area.areaId, MINING_AREA_INDEX_BY_ID, getTierForMiningAreaIndex, ownedSkillingSetRef
      );
      const lootQuantity = rollMiningLootQuantity(miningYieldPercent, Math.random());
      dispatch(completeMiningCast({
        castId,
        xp: Math.round(area.xp * karmaXpMultRef.current),
        miningLootId: area.miningLootId,
        lootQuantity,
        geodeDropped,
        skillingSetDropItem: skillingSetDropItem ?? undefined,
      }));
      if (geodeDropped) dispatch(addToast({ type: "rareDrop", itemName: "Geode" }));
      if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
    }, effectiveDuration);
  }, [currentActivity, currentMiningArea, miningCastStartTime, dispatch, skillSpeedBonusMining, miningYieldPercent]);

  // ── Gathering ──
  useEffect(() => {
    if (currentActivity !== "gather" || currentGatheringArea == null || gatheringCastStartTime != null) return;

    if (gatheringTimeoutRef.current != null) {
      clearTimeout(gatheringTimeoutRef.current);
      gatheringTimeoutRef.current = null;
    }

    const area = currentGatheringArea;
    const effectiveDuration = getEffectiveDuration(area.delay, skillSpeedBonusGathering);
    const castId = ++nextGatheringCastIdRef.current;
    dispatch(setGatheringCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    gatheringTimeoutRef.current = setTimeout(() => {
      gatheringTimeoutRef.current = null;
      const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
      const skillingSetDropItem = rollSkillingSetForArea(
        "gathering", area.areaId, GATHERING_AREA_INDEX_BY_ID, getTierForGatheringAreaIndex, ownedSkillingSetRef
      );
      dispatch(completeGatheringCast({
        castId,
        xp: Math.round(area.xp * karmaXpMultRef.current),
        gatheringLootIds: area.gatheringLootIds,
        rareDropItem: rareDropItem ?? undefined,
        skillingSetDropItem: skillingSetDropItem ?? undefined,
      }));
      if (rareDropItem) dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
      if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
    }, effectiveDuration);
  }, [currentActivity, currentGatheringArea, gatheringCastStartTime, dispatch, skillSpeedBonusGathering]);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      if (fishingTimeoutRef.current != null) clearTimeout(fishingTimeoutRef.current);
      if (miningTimeoutRef.current != null) clearTimeout(miningTimeoutRef.current);
      if (gatheringTimeoutRef.current != null) clearTimeout(gatheringTimeoutRef.current);
    };
  }, []);
}
