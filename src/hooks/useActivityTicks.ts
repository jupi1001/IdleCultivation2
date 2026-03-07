/**
 * Central hook for all background activity progression.
 * Mount this once (in Main) so fishing, meditation, labour, and future
 * activities (mining, gathering, etc.) keep ticking regardless of which
 * view is open. Only expedition is handled elsewhere (it locks the view).
 *
 * One activity at a time; cast completion is idempotent by castId so duplicate
 * or late timeouts do not double-apply XP/loot.
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

  const nextFishingCastIdRef = useRef(0);
  const nextMiningCastIdRef = useRef(0);
  const nextGatheringCastIdRef = useRef(0);
  const skipCastTimeoutClearRef = useRef(false);

  useEffect(() => {
    minerRef.current = miner;
  }, [miner]);

  // Labour: miners generate spirit stones every second (always on, not tied to activity)
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(addMoney(minerRef.current));
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
  const qiPerSecond =
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique?.qiGainBonus ?? 0) + (equipment.amulet?.qiGainBonus ?? 0)) * 10) / 10;
  useEffect(() => {
    if (currentActivity !== "meditate") return;
    const id = setInterval(() => dispatch(addQi(qiPerSecond)), 1000);
    return () => clearInterval(id);
  }, [currentActivity, dispatch, qiPerSecond]);

  // Fishing, mining, gathering: one cast per duration each; only one activity active at a time. Completion is idempotent by castId.
  useEffect(() => {
    if (currentActivity === "fish" && currentFishingArea != null && fishingCastStartTime == null) {
      const area = currentFishingArea;
      const effectiveDuration = Math.max(100, area.fishingDelay * (1 - skillSpeedBonusFishing / 100));
      const castId = ++nextFishingCastIdRef.current;
      dispatch(setFishingCast({ startTime: Date.now(), duration: effectiveDuration, castId }));
      const id = setTimeout(() => {
        const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
        const skillingSetDropItem = rollSkillingSetForArea(
          "fishing",
          area.areaId,
          fishingAreaData,
          getTierForFishingAreaIndex,
          ownedSkillingSetRef
        );
        dispatch(
          completeFishingCast({
            castId,
            fishingXP: area.fishingXP,
            fishingLootIds: area.fishingLootIds,
            rareDropItem: rareDropItem ?? undefined,
            skillingSetDropItem: skillingSetDropItem ?? undefined,
          })
        );
        if (rareDropItem) dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
        if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }, effectiveDuration);
      skipCastTimeoutClearRef.current = true;
      return () => {
        if (skipCastTimeoutClearRef.current) {
          skipCastTimeoutClearRef.current = false;
          return;
        }
        clearTimeout(id);
      };
    }

    if (currentActivity === "mine" && currentMiningArea != null && miningCastStartTime == null) {
      const area = currentMiningArea;
      const effectiveDuration = Math.max(100, area.miningDelay * (1 - skillSpeedBonusMining / 100));
      const castId = ++nextMiningCastIdRef.current;
      dispatch(setMiningCast({ startTime: Date.now(), duration: effectiveDuration, castId }));
      const id = setTimeout(() => {
        const geodeDropped = Math.random() * 100 < 3;
        const skillingSetDropItem = rollSkillingSetForArea(
          "mining",
          area.areaId,
          miningAreaData,
          getTierForMiningAreaIndex,
          ownedSkillingSetRef
        );
        dispatch(
          completeMiningCast({
            castId,
            miningXP: area.miningXP,
            miningLootId: area.miningLootId,
            geodeDropped,
            skillingSetDropItem: skillingSetDropItem ?? undefined,
          })
        );
        if (geodeDropped) dispatch(addToast({ type: "rareDrop", itemName: "Geode" }));
        if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }, effectiveDuration);
      skipCastTimeoutClearRef.current = true;
      return () => {
        if (skipCastTimeoutClearRef.current) {
          skipCastTimeoutClearRef.current = false;
          return;
        }
        clearTimeout(id);
      };
    }

    if (currentActivity === "gather" && currentGatheringArea != null && gatheringCastStartTime == null) {
      const area = currentGatheringArea;
      const effectiveDuration = Math.max(100, area.gatheringDelay * (1 - skillSpeedBonusGathering / 100));
      const castId = ++nextGatheringCastIdRef.current;
      dispatch(setGatheringCast({ startTime: Date.now(), duration: effectiveDuration, castId }));
      const id = setTimeout(() => {
        const rareDropItem = rollRareDropRingAmulet(area.rareDropChancePercent, area.rareDropItemIds);
        const skillingSetDropItem = rollSkillingSetForArea(
          "gathering",
          area.areaId,
          gatheringAreaData,
          getTierForGatheringAreaIndex,
          ownedSkillingSetRef
        );
        dispatch(
          completeGatheringCast({
            castId,
            gatheringXP: area.gatheringXP,
            gatheringLootIds: area.gatheringLootIds,
            rareDropItem: rareDropItem ?? undefined,
            skillingSetDropItem: skillingSetDropItem ?? undefined,
          })
        );
        if (rareDropItem) dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
        if (skillingSetDropItem) dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }, effectiveDuration);
      skipCastTimeoutClearRef.current = true;
      return () => {
        if (skipCastTimeoutClearRef.current) {
          skipCastTimeoutClearRef.current = false;
          return;
        }
        clearTimeout(id);
      };
    }
  }, [
    currentActivity,
    currentFishingArea,
    fishingCastStartTime,
    currentMiningArea,
    miningCastStartTime,
    currentGatheringArea,
    gatheringCastStartTime,
    dispatch,
    skillSpeedBonusFishing,
    skillSpeedBonusMining,
    skillSpeedBonusGathering,
  ]);
}
