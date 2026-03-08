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
import { useDispatch, useSelector } from "react-redux";
import {
  addMoney,
  addQi,
  completeFishingCast,
  completeGatheringCast,
  completeMiningCast,
  setFishingCast,
  setGatheringCast,
  setMiningCast,
  setLastActiveTimestamp,
} from "../state/reducers/characterSlice";
import { addToast } from "../state/reducers/toastSlice";
import { getRingAmuletItemById } from "../constants/ringsAmulets";
import {
  getSkillingSetItemById,
  getSetPieceIds,
  getTierForFishingAreaIndex,
  getTierForGatheringAreaIndex,
  getTierForMiningAreaIndex,
  SKILLING_SET_DROP_CHANCE_PERCENT,
} from "../constants/skillingSets";
import { fishingAreaData, gatheringAreaData, miningAreaData } from "../constants/data";
import {
  getSkillSpeedBonusFishing,
  getSkillSpeedBonusMining,
  getSkillSpeedBonusGathering,
  getOwnedSkillingSetPieceIds,
  getKarmaQiMultiplier,
  getKarmaSkillXpMultiplier,
  getKarmaSpiritStoneMultiplier,
  getTalentQiGainBonus,
  getTalentSpiritStoneMultiplier,
} from "../state/selectors/characterSelectors";
import { rollOneTimeDrop } from "../utils/oneTimeDrops";
import { RootState } from "../state/store";
import { BASE_QI_PER_SECOND } from "../constants/meditation";
import type Item from "../interfaces/ItemI";

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
  areaData: { id: number }[],
  getTier: (areaIndex: number) => "lesser" | "greater" | "perfected",
  ownedRef: React.MutableRefObject<Set<number>>
): Item | null {
  const areaIndex = areaData.findIndex((a) => a.id === areaId);
  if (areaIndex < 0) return null;
  const tier = getTier(areaIndex);
  const pieceIds = getSetPieceIds(skill, tier);
  return rollOneTimeDrop(ownedRef.current, pieceIds, SKILLING_SET_DROP_CHANCE_PERCENT, getSkillingSetItemById);
}

export function useActivityTicks() {
  const dispatch = useDispatch();
  const currentActivity = useSelector((state: RootState) => state.character.currentActivity);
  const currentFishingArea = useSelector((state: RootState) => state.character.currentFishingArea);
  const fishingCastStartTime = useSelector((state: RootState) => state.character.fishingCastStartTime);
  const currentMiningArea = useSelector((state: RootState) => state.character.currentMiningArea);
  const miningCastStartTime = useSelector((state: RootState) => state.character.miningCastStartTime);
  const currentGatheringArea = useSelector((state: RootState) => state.character.currentGatheringArea);
  const gatheringCastStartTime = useSelector((state: RootState) => state.character.gatheringCastStartTime);
  const equipment = useSelector((state: RootState) => state.character.equipment);
  const miner = useSelector((state: RootState) => state.character.miner);
  const minerRef = useRef(miner);
  const skillSpeedBonusFishing = useSelector(getSkillSpeedBonusFishing);
  const skillSpeedBonusMining = useSelector(getSkillSpeedBonusMining);
  const skillSpeedBonusGathering = useSelector(getSkillSpeedBonusGathering);
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedSkillingSetRef = useRef<Set<number>>(new Set());
  ownedSkillingSetRef.current = ownedSkillingSetPieceIds;
  const karmaQiMult = useSelector(getKarmaQiMultiplier);
  const karmaXpMult = useSelector(getKarmaSkillXpMultiplier);
  const karmaSsMult = useSelector(getKarmaSpiritStoneMultiplier);
  const talentSsMult = useSelector(getTalentSpiritStoneMultiplier);
  const talentQiGain = useSelector(getTalentQiGainBonus);
  const karmaQiMultRef = useRef(karmaQiMult);
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

  // Meditation: +Qi per second while currentActivity === "meditate"
  const baseQiPerSecond =
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique?.qiGainBonus ?? 0) + (equipment.amulet?.qiGainBonus ?? 0) + talentQiGain) * 10) / 10;
  const qiPerSecond = Math.round(baseQiPerSecond * karmaQiMult * 100) / 100;
  useEffect(() => {
    if (currentActivity !== "meditate") return;
    const id = setInterval(() => dispatch(addQi(qiPerSecond)), 1000);
    return () => clearInterval(id);
  }, [currentActivity, dispatch, qiPerSecond]);

  // ── Fishing ──
  useEffect(() => {
    if (currentActivity !== "fish" || currentFishingArea == null || fishingCastStartTime != null) return;

    if (fishingTimeoutRef.current != null) {
      clearTimeout(fishingTimeoutRef.current);
      fishingTimeoutRef.current = null;
    }

    const area = currentFishingArea;
    const effectiveDuration = Math.max(100, area.fishingDelay * (1 - skillSpeedBonusFishing / 100));
    const castId = ++nextFishingCastIdRef.current;
    dispatch(setFishingCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    fishingTimeoutRef.current = setTimeout(() => {
      fishingTimeoutRef.current = null;
      const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
      const skillingSetDropItem = rollSkillingSetForArea(
        "fishing", area.areaId, fishingAreaData, getTierForFishingAreaIndex, ownedSkillingSetRef
      );
      dispatch(completeFishingCast({
        castId,
        fishingXP: Math.round(area.fishingXP * karmaXpMultRef.current),
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
    const effectiveDuration = Math.max(100, area.miningDelay * (1 - skillSpeedBonusMining / 100));
    const castId = ++nextMiningCastIdRef.current;
    dispatch(setMiningCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    miningTimeoutRef.current = setTimeout(() => {
      miningTimeoutRef.current = null;
      const geodeDropped = Math.random() * 100 < 3;
      const skillingSetDropItem = rollSkillingSetForArea(
        "mining", area.areaId, miningAreaData, getTierForMiningAreaIndex, ownedSkillingSetRef
      );
      dispatch(completeMiningCast({
        castId,
        miningXP: Math.round(area.miningXP * karmaXpMultRef.current),
        miningLootId: area.miningLootId,
        geodeDropped,
        skillingSetDropItem: skillingSetDropItem ?? undefined,
      }));
      if (geodeDropped) dispatch(addToast({ type: "rareDrop", itemName: "Geode" }));
      if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
    }, effectiveDuration);
  }, [currentActivity, currentMiningArea, miningCastStartTime, dispatch, skillSpeedBonusMining]);

  // ── Gathering ──
  useEffect(() => {
    if (currentActivity !== "gather" || currentGatheringArea == null || gatheringCastStartTime != null) return;

    if (gatheringTimeoutRef.current != null) {
      clearTimeout(gatheringTimeoutRef.current);
      gatheringTimeoutRef.current = null;
    }

    const area = currentGatheringArea;
    const effectiveDuration = Math.max(100, area.gatheringDelay * (1 - skillSpeedBonusGathering / 100));
    const castId = ++nextGatheringCastIdRef.current;
    dispatch(setGatheringCast({ startTime: Date.now(), duration: effectiveDuration, castId }));

    gatheringTimeoutRef.current = setTimeout(() => {
      gatheringTimeoutRef.current = null;
      const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
      const skillingSetDropItem = rollSkillingSetForArea(
        "gathering", area.areaId, gatheringAreaData, getTierForGatheringAreaIndex, ownedSkillingSetRef
      );
      dispatch(completeGatheringCast({
        castId,
        gatheringXP: Math.round(area.gatheringXP * karmaXpMultRef.current),
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
