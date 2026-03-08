import React from "react";
import { useSelector } from "react-redux";
import { existingSkills } from "../../constants/data";
import { getStepIndex } from "../../constants/realmProgression";
import { REINCARNATION_MIN_STEP } from "../../constants/reincarnation";
import { selectRealm, selectRealmLevel, selectReincarnationCount } from "../../state/selectors/characterSelectors";
import SkillBlockItem from "../SkillBlockItem/SkillBlockItem";
import "./SkillBlock.css";

const REINCARNATION_SKILL = { id: 100, name: "Reincarnation", description: "Sacrifice this life for permanent power" };

const SkillBlock = () => {
  const realm = useSelector(selectRealm);
  const realmLevel = useSelector(selectRealmLevel);
  const reincarnationCount = useSelector(selectReincarnationCount);
  const step = getStepIndex(realm, realmLevel);
  const showReincarnation = (reincarnationCount ?? 0) > 0 || step >= REINCARNATION_MIN_STEP;

  return (
    <div className="skill-block">
      {existingSkills.map((skill, index) => (
        <SkillBlockItem key={index} skill={skill} />
      ))}
      {showReincarnation && <SkillBlockItem key="reincarnation" skill={REINCARNATION_SKILL} />}
    </div>
  );
};

export default SkillBlock;
