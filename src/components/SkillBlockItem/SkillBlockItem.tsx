import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLockingActivity } from "../../constants/activities";
import { ALCHEMY_MAX_LEVEL, getAlchemyLevel } from "../../constants/alchemy";
import { COOKING_MAX_LEVEL, getCookingLevel } from "../../constants/cooking";
import { FISHING_MAX_LEVEL, getFishingLevelInfo } from "../../constants/fishingLevel";
import { FORGING_MAX_LEVEL, getForgingLevel } from "../../constants/forging";
import { GATHERING_MAX_LEVEL, getGatheringLevelInfo } from "../../constants/gatheringLevel";
import { MINING_MAX_LEVEL, getMiningLevelInfo } from "../../constants/miningLevel";
import SkillI from "../../interfaces/SkillI";
import "./SkillBlockItem.css";
import { changeContent, routeForSkillName } from "../../state/reducers/contentSlice";
import {
  selectCurrentActivity,
  selectFishingXP,
  selectMiningXP,
  selectGatheringXP,
  selectAlchemyXP,
  selectForgingXP,
  selectCookingXP,
} from "../../state/selectors/characterSelectors";

const PATH_ACCENT_COLORS: Record<string, string> = {
  "Martial Training": "#a04040",
  "Labour": "#b8860b",
  "Meditation": "#6b4e71",
  "Immortals Island": "#6b8e6b",
  "Fishing": "#4a6fa5",
  "Mining": "#5c6b73",
  "Gathering": "#4a7c59",
  "Cultivation Tree": "#9a7b4a",
  "Alchemy": "#4a9b8e",
  "Forging": "#b85c38",
  "Cooking": "#c17f59",
  "Reincarnation": "#d4af37",
};

interface SkillItemProps {
  skill: SkillI;
}

const SkillBlockItem: React.FC<SkillItemProps> = React.memo(({ skill }) => {
  const dispatch = useDispatch();
  const currentActivity = useSelector(selectCurrentActivity);
  const fishingXP = useSelector(selectFishingXP);
  const miningXP = useSelector(selectMiningXP);
  const gatheringXP = useSelector(selectGatheringXP);
  const alchemyXP = useSelector(selectAlchemyXP);
  const forgingXP = useSelector(selectForgingXP);
  const cookingXP = useSelector(selectCookingXP);
  const accentColor = PATH_ACCENT_COLORS[skill.name] ?? "var(--accent)";
  const isNavigationLocked = isLockingActivity(currentActivity);
  const isBlocked = isNavigationLocked && skill.name !== "Immortals Island";
  const fishingLevel = skill.name === "Fishing" ? getFishingLevelInfo(fishingXP).level : null;
  const miningLevel = skill.name === "Mining" ? getMiningLevelInfo(miningXP).level : null;
  const gatheringLevel = skill.name === "Gathering" ? getGatheringLevelInfo(gatheringXP).level : null;
  const alchemyLevel = skill.name === "Alchemy" ? getAlchemyLevel(alchemyXP) : null;
  const forgingLevel = skill.name === "Forging" ? getForgingLevel(forgingXP) : null;
  const cookingLevel = skill.name === "Cooking" ? getCookingLevel(cookingXP) : null;

  const openSkill = (input: string) => {
    if (isBlocked) return;
    dispatch(changeContent(routeForSkillName(input)));
  };

  return (
    <div
      className={`skillBlockItem__main ${isBlocked ? "skillBlockItem__main--disabled" : ""}`}
      onClick={() => openSkill(skill.name)}
      style={{ "--path-accent": accentColor } as React.CSSProperties}
    >
      <h3>
        {skill.name}
        {fishingLevel !== null && (
          <span className="skillBlockItem__level"> Level {fishingLevel}/{FISHING_MAX_LEVEL}</span>
        )}
        {miningLevel !== null && (
          <span className="skillBlockItem__level"> Level {miningLevel}/{MINING_MAX_LEVEL}</span>
        )}
        {gatheringLevel !== null && (
          <span className="skillBlockItem__level"> Level {gatheringLevel}/{GATHERING_MAX_LEVEL}</span>
        )}
        {alchemyLevel !== null && (
          <span className="skillBlockItem__level"> Level {alchemyLevel}/{ALCHEMY_MAX_LEVEL}</span>
        )}
        {forgingLevel !== null && (
          <span className="skillBlockItem__level"> Level {forgingLevel}/{FORGING_MAX_LEVEL}</span>
        )}
        {cookingLevel !== null && (
          <span className="skillBlockItem__level"> Level {cookingLevel}/{COOKING_MAX_LEVEL}</span>
        )}
      </h3>
      <p className="skillBlockItem__main-p">{skill.description}</p>
    </div>
  );
});

export default SkillBlockItem;
