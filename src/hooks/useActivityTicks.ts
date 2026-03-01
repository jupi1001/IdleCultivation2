/**
 * Central hook for all background activity progression.
 * Mount this once (in Main) so fishing, meditation, labour, and future
 * activities (mining, gathering, etc.) keep ticking regardless of which
 * view is open. Only expedition is handled elsewhere (it locks the view).
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
import { getSkillSpeedBonus, getOwnedSkillingSetPieceIds } from "../state/selectors/characterSelectors";
import { RootState } from "../state/store";
import { BASE_QI_PER_SECOND } from "../constants/meditation";

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
  const skillSpeedBonusFishing = useSelector(getSkillSpeedBonus("fishing"));
  const skillSpeedBonusMining = useSelector(getSkillSpeedBonus("mining"));
  const skillSpeedBonusGathering = useSelector(getSkillSpeedBonus("gathering"));
  const ownedSkillingSetPieceIds = useSelector(getOwnedSkillingSetPieceIds);
  const ownedSkillingSetRef = useRef<Set<number>>(new Set());
  ownedSkillingSetRef.current = ownedSkillingSetPieceIds;

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

  // Meditation: +Qi per second while currentActivity === "meditate"
  const qiPerSecond =
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique?.qiGainBonus ?? 0) + (equipment.amulet?.qiGainBonus ?? 0)) * 10) / 10;
  useEffect(() => {
    if (currentActivity !== "meditate") return;
    const id = setInterval(() => dispatch(addQi(qiPerSecond)), 1000);
    return () => clearInterval(id);
  }, [currentActivity, dispatch, qiPerSecond]);

  // Fishing: one cast per duration, loop while currentActivity === "fish" && currentFishingArea
  const skipFishingTimeoutClearRef = useRef(false);
  useEffect(() => {
    if (
      currentActivity !== "fish" ||
      !currentFishingArea ||
      fishingCastStartTime != null
    )
      return;
    const effectiveDuration = Math.max(
      100,
      currentFishingArea.fishingDelay * (1 - skillSpeedBonusFishing / 100)
    );
    const startTime = Date.now();
    dispatch(
      setFishingCast({ startTime, duration: effectiveDuration })
    );
    const id = setTimeout(() => {
      const rareDropItem = (() => {
        if (
          currentFishingArea.rareDropChancePercent != null &&
          currentFishingArea.rareDropItemIds != null &&
          currentFishingArea.rareDropItemIds.length > 0 &&
          Math.random() * 100 < currentFishingArea.rareDropChancePercent
        ) {
          const rareId =
            currentFishingArea.rareDropItemIds[
              Math.floor(Math.random() * currentFishingArea.rareDropItemIds.length)
            ];
          return getRingAmuletItemById(rareId) ?? null;
        }
        return null;
      })();
      const skillingSetDropItem = (() => {
        const areaIndex = fishingAreaData.findIndex((a) => a.id === currentFishingArea.areaId);
        if (areaIndex < 0) return null;
        if (Math.random() * 100 >= SKILLING_SET_DROP_CHANCE_PERCENT) return null;
        const tier = getTierForFishingAreaIndex(areaIndex);
        const pieceIds = getSetPieceIds("fishing", tier);
        const available = pieceIds.filter((id) => !ownedSkillingSetRef.current.has(id));
        if (available.length === 0) return null;
        const pieceId = available[Math.floor(Math.random() * available.length)];
        return getSkillingSetItemById(pieceId) ?? null;
      })();
      dispatch(
        completeFishingCast({
          fishingXP: currentFishingArea.fishingXP,
          fishingLootIds: currentFishingArea.fishingLootIds,
          rareDropChancePercent: currentFishingArea.rareDropChancePercent,
          rareDropItemIds: currentFishingArea.rareDropItemIds,
          rareDropItem: rareDropItem ?? undefined,
          skillingSetDropItem: skillingSetDropItem ?? undefined,
        })
      );
      if (rareDropItem) {
        dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
      }
      if (skillingSetDropItem) {
        dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }
    }, effectiveDuration);
    skipFishingTimeoutClearRef.current = true;
    return () => {
      if (skipFishingTimeoutClearRef.current) {
        skipFishingTimeoutClearRef.current = false;
        return;
      }
      clearTimeout(id);
    };
  }, [
    currentActivity,
    currentFishingArea,
    fishingCastStartTime,
    dispatch,
    skillSpeedBonusFishing,
  ]);

  // Mining: one swing per duration, loop while currentActivity === "mine" && currentMiningArea
  const skipMiningTimeoutClearRef = useRef(false);
  useEffect(() => {
    if (
      currentActivity !== "mine" ||
      !currentMiningArea ||
      miningCastStartTime != null
    )
      return;
    const effectiveDuration = Math.max(
      100,
      currentMiningArea.miningDelay * (1 - skillSpeedBonusMining / 100)
    );
    const startTime = Date.now();
    dispatch(
      setMiningCast({ startTime, duration: effectiveDuration })
    );
    const id = setTimeout(() => {
      const geodeDropped = Math.random() * 100 < 3;
      const skillingSetDropItem = (() => {
        const areaIndex = miningAreaData.findIndex((a) => a.id === currentMiningArea.areaId);
        if (areaIndex < 0) return null;
        if (Math.random() * 100 >= SKILLING_SET_DROP_CHANCE_PERCENT) return null;
        const tier = getTierForMiningAreaIndex(areaIndex);
        const pieceIds = getSetPieceIds("mining", tier);
        const available = pieceIds.filter((id) => !ownedSkillingSetRef.current.has(id));
        if (available.length === 0) return null;
        const pieceId = available[Math.floor(Math.random() * available.length)];
        return getSkillingSetItemById(pieceId) ?? null;
      })();
      dispatch(
        completeMiningCast({
          miningXP: currentMiningArea.miningXP,
          miningLootId: currentMiningArea.miningLootId,
          geodeDropped,
          skillingSetDropItem: skillingSetDropItem ?? undefined,
        })
      );
      if (geodeDropped) {
        dispatch(addToast({ type: "rareDrop", itemName: "Geode" }));
      }
      if (skillingSetDropItem) {
        dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }
    }, effectiveDuration);
    skipMiningTimeoutClearRef.current = true;
    return () => {
      if (skipMiningTimeoutClearRef.current) {
        skipMiningTimeoutClearRef.current = false;
        return;
      }
      clearTimeout(id);
    };
  }, [
    currentActivity,
    currentMiningArea,
    miningCastStartTime,
    dispatch,
    skillSpeedBonusMining,
  ]);

  // Gathering: one gather per duration, loop while currentActivity === "gather" && currentGatheringArea
  const skipGatheringTimeoutClearRef = useRef(false);
  useEffect(() => {
    if (
      currentActivity !== "gather" ||
      !currentGatheringArea ||
      gatheringCastStartTime != null
    )
      return;
    const effectiveDuration = Math.max(
      100,
      currentGatheringArea.gatheringDelay * (1 - skillSpeedBonusGathering / 100)
    );
    const startTime = Date.now();
    dispatch(
      setGatheringCast({ startTime, duration: effectiveDuration })
    );
    const id = setTimeout(() => {
      const rareDropItem = (() => {
        if (
          currentGatheringArea.rareDropChancePercent != null &&
          currentGatheringArea.rareDropItemIds != null &&
          currentGatheringArea.rareDropItemIds.length > 0 &&
          Math.random() * 100 < currentGatheringArea.rareDropChancePercent
        ) {
          const rareId =
            currentGatheringArea.rareDropItemIds[
              Math.floor(Math.random() * currentGatheringArea.rareDropItemIds.length)
            ];
          return getRingAmuletItemById(rareId) ?? null;
        }
        return null;
      })();
      const skillingSetDropItem = (() => {
        const areaIndex = gatheringAreaData.findIndex((a) => a.id === currentGatheringArea.areaId);
        if (areaIndex < 0) return null;
        if (Math.random() * 100 >= SKILLING_SET_DROP_CHANCE_PERCENT) return null;
        const tier = getTierForGatheringAreaIndex(areaIndex);
        const pieceIds = getSetPieceIds("gathering", tier);
        const available = pieceIds.filter((id) => !ownedSkillingSetRef.current.has(id));
        if (available.length === 0) return null;
        const pieceId = available[Math.floor(Math.random() * available.length)];
        return getSkillingSetItemById(pieceId) ?? null;
      })();
      dispatch(
        completeGatheringCast({
          gatheringXP: currentGatheringArea.gatheringXP,
          gatheringLootIds: currentGatheringArea.gatheringLootIds,
          rareDropChancePercent: currentGatheringArea.rareDropChancePercent,
          rareDropItemIds: currentGatheringArea.rareDropItemIds,
          rareDropItem: rareDropItem ?? undefined,
          skillingSetDropItem: skillingSetDropItem ?? undefined,
        })
      );
      if (rareDropItem) {
        dispatch(addToast({ type: "rareDrop", itemName: rareDropItem.name }));
      }
      if (skillingSetDropItem) {
        dispatch(addToast({ type: "rareDrop", itemName: skillingSetDropItem.name }));
      }
    }, effectiveDuration);
    skipGatheringTimeoutClearRef.current = true;
    return () => {
      if (skipGatheringTimeoutClearRef.current) {
        skipGatheringTimeoutClearRef.current = false;
        return;
      }
      clearTimeout(id);
    };
  }, [
    currentActivity,
    currentGatheringArea,
    gatheringCastStartTime,
    dispatch,
    skillSpeedBonusGathering,
  ]);
}
