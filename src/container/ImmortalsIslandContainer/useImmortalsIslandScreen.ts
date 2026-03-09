import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { canEnterArea, formatRealmRequirement } from "../../constants/areaRealmRequirements";
import {
  AVATAR_CREATE_ORE_AMOUNT,
  AVATAR_CREATE_ORE_ID,
  AVATAR_CREATE_SPIRIT_STONES,
  AVATAR_CREATE_WOOD_AMOUNT,
  AVATAR_CREATE_WOOD_ID,
  AVATAR_TRAIN_QI_PILL_AMOUNT,
  AVATAR_TRAIN_SPIRIT_STONES,
  canCreateAvatar,
} from "../../constants/avatars";
import { ITEMS_BY_ID } from "../../constants/data";
import {
  EXPEDITION_MISSIONS,
  EXPEDITION_MISSIONS_BY_ID,
  getExpeditionItem,
} from "../../constants/expeditions";
import { getConsumableEffect } from "../../interfaces/ItemI";
import type { MissionI } from "../../interfaces/MissionI";
import { createAvatar, trainAvatar } from "../../state/reducers/avatarsSlice";
import { startExpedition, clearExpedition } from "../../state/reducers/avatarsThunks";
import { addMoney, reduceMoney } from "../../state/reducers/characterCoreSlice";
import { addItemById, consumeItems } from "../../state/reducers/inventorySlice";
import { addToast } from "../../state/reducers/toastSlice";
import {
  selectRealm,
  selectRealmLevel,
  selectExpeditionEndTime,
  selectExpeditionMissionId,
  selectCurrentActivity,
  selectMoney,
  selectItemsById,
  selectEquipment,
  selectAvatars,
} from "../../state/selectors/characterSelectors";
import type { RootState } from "../../state/store";
import { useAppDispatch } from "../../state/store";
import { rollOneTimeDropFromTable } from "../../utils/oneTimeDrops";
import { getOwnedItemIds } from "../../utils/ownership";

export function useImmortalsIslandScreen() {
  const dispatch = useAppDispatch();
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const expeditionEndTime = useSelector(selectExpeditionEndTime);
  const expeditionMissionId = useSelector(selectExpeditionMissionId);
  const currentActivity = useSelector(selectCurrentActivity);
  const money = useSelector(selectMoney) as number;
  const itemsById = useSelector(selectItemsById) as Record<number, number>;
  const equipment = useSelector(selectEquipment) as RootState["equipment"]["equipment"];
  const avatarsResolved = useSelector(selectAvatars) as
    | RootState["avatars"]["avatars"]
    | undefined;
  const avatars: RootState["avatars"]["avatars"] = avatarsResolved ?? [];

  const [, setTick] = useState(0);
  const [avatarsOpen, setAvatarsOpen] = useState(true);
  const [createName, setCreateName] = useState("");
  const completionCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expeditionContextRef = useRef({
    expeditionEndTime,
    expeditionMissionId,
    itemsById,
    equipment,
    avatars,
  });

  expeditionContextRef.current = {
    expeditionEndTime,
    expeditionMissionId,
    itemsById,
    equipment,
    avatars,
  };

  const isMainOnExpedition = currentActivity === "expedition" && expeditionEndTime != null;
  const currentMission =
    expeditionMissionId != null ? EXPEDITION_MISSIONS_BY_ID[expeditionMissionId] : null;
  const mainSecondsLeft =
    isMainOnExpedition && expeditionEndTime != null
      ? Math.max(0, Math.ceil((expeditionEndTime - Date.now()) / 1000))
      : 0;

  const oreQty = itemsById[AVATAR_CREATE_ORE_ID] ?? 0;
  const woodQty = itemsById[AVATAR_CREATE_WOOD_ID] ?? 0;
  const canAffordAvatar =
    money >= AVATAR_CREATE_SPIRIT_STONES &&
    oreQty >= AVATAR_CREATE_ORE_AMOUNT &&
    woodQty >= AVATAR_CREATE_WOOD_AMOUNT;
  const avatarUnlocked = canCreateAvatar(realm, realmLevel);
  const showCreateAvatar = avatarUnlocked && canAffordAvatar;

  useEffect(() => {
    if (!isMainOnExpedition && !avatars.some((a) => a.isBusy)) return;
    const intervalId = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isMainOnExpedition, avatars]);

  useEffect(() => {
    const checkCompletions = () => {
      const current = expeditionContextRef.current;
      const now = Date.now();

      if (current.expeditionEndTime != null && now >= current.expeditionEndTime) {
        const mission =
          current.expeditionMissionId != null
            ? EXPEDITION_MISSIONS_BY_ID[current.expeditionMissionId]
            : undefined;
        if (mission) {
          const spiritStones =
            mission.spiritStonesMin +
            Math.floor(Math.random() * (mission.spiritStonesMax - mission.spiritStonesMin + 1));
          dispatch(addMoney(spiritStones));
          const ownedIds = getOwnedItemIds({
            itemsById: current.itemsById,
            equipment: current.equipment,
          });
          const rareItem = rollOneTimeDropFromTable(
            ownedIds,
            mission.rareDrops,
            getExpeditionItem
          );
          let rareItemName: string | null = null;
          if (rareItem) {
            dispatch(addItemById({ itemId: rareItem.id, amount: 1 }));
            rareItemName = rareItem.name;
          }
          dispatch(clearExpedition({ entityType: "main" }));
          dispatch(
            addToast({
              type: "expedition",
              expeditionName: mission.name,
              spiritStones,
              rareItemName,
            })
          );
        } else {
          dispatch(clearExpedition({ entityType: "main" }));
        }
      }

      for (const avatar of current.avatars ?? []) {
        if (avatar.expeditionEndTime == null || now < avatar.expeditionEndTime) continue;
        const mission =
          avatar.expeditionMissionId != null
            ? EXPEDITION_MISSIONS_BY_ID[avatar.expeditionMissionId]
            : undefined;
        if (mission) {
          const spiritStones =
            mission.spiritStonesMin +
            Math.floor(Math.random() * (mission.spiritStonesMax - mission.spiritStonesMin + 1));
          dispatch(addMoney(spiritStones));
          const stateForRare = expeditionContextRef.current;
          const ownedIds = getOwnedItemIds({
            itemsById: stateForRare.itemsById,
            equipment: stateForRare.equipment,
          });
          const rareItem = rollOneTimeDropFromTable(
            ownedIds,
            mission.rareDrops,
            getExpeditionItem
          );
          let rareItemName: string | null = null;
          if (rareItem) {
            dispatch(addItemById({ itemId: rareItem.id, amount: 1 }));
            rareItemName = rareItem.name;
          }
          dispatch(clearExpedition({ entityType: "avatar", avatarId: avatar.id }));
          dispatch(
            addToast({
              type: "expedition",
              expeditionName: `${avatar.name}: ${mission.name}`,
              spiritStones,
              rareItemName,
            })
          );
        } else {
          dispatch(clearExpedition({ entityType: "avatar", avatarId: avatar.id }));
        }
      }
    };

    completionCheckRef.current = setInterval(checkCompletions, 500);
    return () => {
      if (completionCheckRef.current) clearInterval(completionCheckRef.current);
    };
  }, [expeditionEndTime, expeditionMissionId, avatars, dispatch]);

  const handleStartMission = (mission: MissionI, entityType: "main" | "avatar", avatarId?: number) => {
    const endTime = Date.now() + mission.durationSeconds * 1000;
    if (entityType === "main") {
      dispatch(startExpedition({ endTime, missionId: mission.id, entityType: "main" }));
    } else if (avatarId != null) {
      dispatch(startExpedition({ endTime, missionId: mission.id, entityType: "avatar", avatarId }));
    }
  };

  const handleCreateAvatar = () => {
    const name = createName.trim() || `Avatar ${avatars.length + 1}`;
    if (!canAffordAvatar) return;
    dispatch(reduceMoney(AVATAR_CREATE_SPIRIT_STONES));
    dispatch(
      consumeItems([
        { itemId: AVATAR_CREATE_ORE_ID, amount: AVATAR_CREATE_ORE_AMOUNT },
        { itemId: AVATAR_CREATE_WOOD_ID, amount: AVATAR_CREATE_WOOD_AMOUNT },
      ])
    );
    dispatch(createAvatar({ name }));
    setCreateName("");
  };

  const handleTrainAvatarWithStones = (avatarId: number) => {
    if (money < AVATAR_TRAIN_SPIRIT_STONES) return;
    dispatch(reduceMoney(AVATAR_TRAIN_SPIRIT_STONES));
    dispatch(trainAvatar({ avatarId, costType: "spiritStones" }));
  };

  const handleTrainAvatarWithQiPill = (avatarId: number, itemId: number) => {
    dispatch(
      consumeItems([{ itemId, amount: AVATAR_TRAIN_QI_PILL_AMOUNT }])
    );
    dispatch(trainAvatar({ avatarId, costType: "qiPill", itemId }));
  };

  function groupMissionsByRealmLocal(missions: MissionI[]): { realmLabel: string; missions: MissionI[] }[] {
    const groups: { realmLabel: string; missions: MissionI[] }[] = [];
    const seen = new Set<string>();
    for (const m of missions) {
      const label = formatRealmRequirement(m.requiredRealm);
      if (!seen.has(label)) {
        seen.add(label);
        groups.push({ realmLabel: label, missions: [] });
      }
      groups.find((g) => g.realmLabel === label)!.missions.push(m);
    }
    return groups;
  }

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }

  return {
    realm,
    realmLevel,
    money,
    itemsById,
    avatars,
    avatarsOpen,
    setAvatarsOpen,
    createName,
    setCreateName,
    isMainOnExpedition,
    currentMission,
    mainSecondsLeft,
    canAffordAvatar,
    avatarUnlocked,
    showCreateAvatar,
    oreQty,
    woodQty,
    handleCreateAvatar,
    handleStartMission,
    EXPEDITION_MISSIONS,
    EXPEDITION_MISSIONS_BY_ID,
    AVATAR_CREATE_ORE_AMOUNT,
    AVATAR_CREATE_ORE_ID,
    AVATAR_CREATE_SPIRIT_STONES,
    AVATAR_CREATE_WOOD_AMOUNT,
    AVATAR_CREATE_WOOD_ID,
    AVATAR_TRAIN_QI_PILL_AMOUNT,
    AVATAR_TRAIN_SPIRIT_STONES,
    ITEMS_BY_ID,
    getConsumableEffect,
    canEnterArea,
    formatRealmRequirement,
    getExpeditionItem,
    groupMissionsByRealm: groupMissionsByRealmLocal,
    formatDuration,
    handleTrainAvatarWithStones,
    handleTrainAvatarWithQiPill,
  };
}

