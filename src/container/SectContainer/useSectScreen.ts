import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SECTS_BY_ID, SECT_POSITIONS, sectStoreData } from "../../constants/data";
import { getStepIndex } from "../../constants/realmProgression";
import {
  SECT_NPCS_BY_SECT,
  SECT_QUEST_KILLS_REQUIRED,
  REALM_DIALOGUE_REALMS,
  DUAL_CULTIVATION_MIN_FAVOR,
  GIFT_SPIRIT_STONE_COST,
  SECT_TREASURE_ITEM_ID_BY_SECT,
} from "../../constants/sectRelationships";
import { ContentArea } from "../../enum/ContentArea";
import { reduceMoney } from "../../state/reducers/characterCoreSlice";
import { changeContent, routeFromArea } from "../../state/reducers/contentSlice";
import { addItemById } from "../../state/reducers/inventorySlice";
import {
  setSect,
  startPromotion,
  completePromotion,
  acceptSectQuest,
  claimSectQuestReward,
  giftNpc,
  useRealmDialogue,
  setCultivationPartner,
} from "../../state/reducers/sectSlice";
import {
  selectCurrentSectId,
  selectSectRankIndex,
  selectRealm,
  selectRealmLevel,
  selectPromotionEndTime,
  selectPromotionToRankIndex,
  selectSectQuestProgress,
  selectSectQuestKillCount,
  selectNpcFavor,
  selectRealmDialogueUsed,
  selectCultivationPartner,
  selectMoney,
} from "../../state/selectors/characterSelectors";

export type SectTab = "store" | "bulletin" | "relationships";

const PROMOTION_DURATION_MS = 5000;

export function useSectScreen() {
  const dispatch = useDispatch();
  const [now, setNow] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<SectTab>("store");
  const [expandedSectIds, setExpandedSectIds] = useState<number[]>([]);

  const currentSectId = useSelector(selectCurrentSectId);
  const sectRankIndex = useSelector(selectSectRankIndex);
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const promotionEndTime = useSelector(selectPromotionEndTime);
  const promotionToRankIndex = useSelector(selectPromotionToRankIndex);
  const sectQuestProgress = useSelector(selectSectQuestProgress);
  const sectQuestKillCount = useSelector(selectSectQuestKillCount);
  const npcFavor = useSelector(selectNpcFavor);
  const realmDialogueUsed = useSelector(selectRealmDialogueUsed);
  const cultivationPartner = useSelector(selectCultivationPartner);
  const money = useSelector(selectMoney);

  const currentSect = currentSectId != null ? SECTS_BY_ID[currentSectId] : null;

  const sectsOnPath =
    currentSectId != null && currentSect != null
      ? Object.values(SECTS_BY_ID)
          .filter((s) => s.path === currentSect.path)
          .map((sect) => ({
            sect,
            entries: sectStoreData[sect.id] ?? [],
          }))
          .sort((a, b) => (a.sect.id === currentSectId ? -1 : b.sect.id === currentSectId ? 1 : 0))
      : [];

  const positionName = SECT_POSITIONS[sectRankIndex]?.name ?? "Sect Aspirant";
  const characterStep = getStepIndex(realm, realmLevel);
  const nextRankIndex = sectRankIndex + 1;
  const nextRank = nextRankIndex < SECT_POSITIONS.length ? SECT_POSITIONS[nextRankIndex] : null;
  const realmMeetsNextRank = nextRank != null && characterStep >= nextRank.requiredStepIndex;
  const isPromoting = promotionEndTime != null && promotionToRankIndex != null;

  const promotionProgress =
    isPromoting && promotionEndTime != null
      ? Math.min(
          1,
          Math.max(
            0,
            (now - (promotionEndTime - PROMOTION_DURATION_MS)) / PROMOTION_DURATION_MS
          )
        )
      : 0;

  useEffect(() => {
    if (!isPromoting) return;
    const t = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(t);
  }, [isPromoting]);

  useEffect(() => {
    if (promotionEndTime != null && Date.now() >= promotionEndTime) {
      dispatch(completePromotion({ realm, realmLevel }));
    }
  }, [now, promotionEndTime, realm, realmLevel, dispatch]);

  useEffect(() => {
    if (currentSectId != null) {
      setExpandedSectIds([currentSectId]);
    }
  }, [currentSectId]);

  const toggleSectStore = (sectId: number) => {
    setExpandedSectIds((prev) =>
      prev.includes(sectId) ? prev.filter((id) => id !== sectId) : [...prev, sectId]
    );
  };

  const openMap = () => dispatch(changeContent(routeFromArea(ContentArea.MAP)));
  const handleLeave = () => dispatch(setSect(null));
  const handlePromote = () =>
    dispatch(startPromotion({ targetRankIndex: nextRankIndex, durationMs: PROMOTION_DURATION_MS }));

  const handleAcceptQuest = (sectId: number) => dispatch(acceptSectQuest(sectId));

  const handleClaimReward = (sectId: number) => {
    dispatch(claimSectQuestReward(sectId));
    const itemId = SECT_TREASURE_ITEM_ID_BY_SECT[sectId];
    if (itemId != null) dispatch(addItemById({ itemId, amount: 1 }));
  };

  const handleGiftNpc = (sectId: number, npcId: number) => {
    dispatch(reduceMoney(GIFT_SPIRIT_STONE_COST));
    dispatch(giftNpc({ sectId, npcId }));
  };

  const handleUseRealmDialogue = (sectId: number, npcId: number) =>
    dispatch(useRealmDialogue({ sectId, npcId, realmId: realm }));

  const handleSetCultivationPartner = (sectId: number, npcId: number, unset: boolean) =>
    dispatch(setCultivationPartner(unset ? null : { sectId, npcId }));

  return {
    // state
    currentSect,
    currentSectId,
    sectRankIndex,
    realm,
    realmLevel,
    promotionEndTime,
    sectQuestProgress,
    sectQuestKillCount,
    npcFavor,
    realmDialogueUsed,
    cultivationPartner,
    money,
    sectsOnPath,
    positionName,
    nextRank,
    realmMeetsNextRank,
    isPromoting,
    promotionProgress,
    expandedSectIds,
    activeTab,
    // constants
    SECT_POSITIONS,
    SECT_NPCS_BY_SECT,
    SECT_QUEST_KILLS_REQUIRED,
    REALM_DIALOGUE_REALMS,
    DUAL_CULTIVATION_MIN_FAVOR,
    GIFT_SPIRIT_STONE_COST,
    // handlers
    setActiveTab,
    toggleSectStore,
    openMap,
    handleLeave,
    handlePromote,
    handleAcceptQuest,
    handleClaimReward,
    handleGiftNpc,
    handleUseRealmDialogue,
    handleSetCultivationPartner,
  };
}

