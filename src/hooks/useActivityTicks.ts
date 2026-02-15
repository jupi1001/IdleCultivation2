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
  completeMiningCast,
  setFishingCast,
  setMiningCast,
} from "../state/reducers/characterSlice";
import { RootState } from "../state/store";
import { BASE_QI_PER_SECOND } from "../constants/meditation";

export function useActivityTicks() {
  const dispatch = useDispatch();
  const currentActivity = useSelector((state: RootState) => state.character.currentActivity);
  const currentFishingArea = useSelector((state: RootState) => state.character.currentFishingArea);
  const fishingCastStartTime = useSelector((state: RootState) => state.character.fishingCastStartTime);
  const currentMiningArea = useSelector((state: RootState) => state.character.currentMiningArea);
  const miningCastStartTime = useSelector((state: RootState) => state.character.miningCastStartTime);
  const equipment = useSelector((state: RootState) => state.character.equipment);
  const miner = useSelector((state: RootState) => state.character.miner);
  const minerRef = useRef(miner);

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
    Math.round((BASE_QI_PER_SECOND + (equipment.qiTechnique?.qiGainBonus ?? 0)) * 10) / 10;
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
    const startTime = Date.now();
    dispatch(
      setFishingCast({ startTime, duration: currentFishingArea.fishingDelay })
    );
    const id = setTimeout(() => {
      dispatch(
        completeFishingCast({
          fishingXP: currentFishingArea.fishingXP,
          fishingLootIds: currentFishingArea.fishingLootIds,
        })
      );
    }, currentFishingArea.fishingDelay);
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
    const startTime = Date.now();
    dispatch(
      setMiningCast({ startTime, duration: currentMiningArea.miningDelay })
    );
    const id = setTimeout(() => {
      dispatch(
        completeMiningCast({
          miningXP: currentMiningArea.miningXP,
          miningLootId: currentMiningArea.miningLootId,
        })
      );
    }, currentMiningArea.miningDelay);
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
  ]);
}
