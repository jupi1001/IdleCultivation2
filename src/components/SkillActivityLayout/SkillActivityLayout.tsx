/**
 * Shared layout for fishing, mining, and gathering skill screens.
 * Renders XP bar, busy message, stop button, cast progress bar, and an areas wrapper.
 * Use with useSkillActivity; pass areas list as children.
 */
import React from "react";
import type { SkillLevelInfo } from "../../hooks/useSkillActivity";
import { SkillXPBar } from "../SkillXPBar/SkillXPBar";

export interface SkillActivityLayoutProps {
  /** Skill display name (e.g. "Fishing", "Mining", "Gathering"). */
  skillName: string;
  levelInfo: SkillLevelInfo;
  maxLevel: number;
  /** Whether the player is busy with another activity. */
  busyWithOther: boolean;
  /** Label for the other activity (e.g. "Combat", "Meditation"). */
  activityLabel: string;
  /** Whether this skill is currently active (casting). */
  isActive: boolean;
  /** Label for the stop button (e.g. "Stop fishing"). */
  stopLabel: string;
  /** Cast progress 0–100. */
  progress: number;
  onStop: () => void;
  /** BEM block for container (e.g. "fishingContainer", "miningContainer"). */
  blockClass: string;
  children: React.ReactNode;
}

export const SkillActivityLayout: React.FC<SkillActivityLayoutProps> = ({
  skillName,
  levelInfo,
  maxLevel,
  busyWithOther,
  activityLabel,
  isActive,
  stopLabel,
  progress,
  onStop,
  blockClass,
  children,
}) => (
  <div className={`${blockClass}__main`}>
    <SkillXPBar
      skillName={skillName}
      level={levelInfo.level}
      maxLevel={maxLevel}
      xpInLevel={levelInfo.xpInLevel}
      xpRequiredForNext={levelInfo.xpRequiredForNext}
    />
    {busyWithOther && (
      <p className={`${blockClass}__busy`}>
        You're busy ({activityLabel}). One activity at a time.
      </p>
    )}
    {isActive && (
      <button
        type="button"
        className={`${blockClass}__stop`}
        onClick={onStop}
      >
        {stopLabel}
      </button>
    )}
    <div
      className={`${blockClass}__cast-bar progress-bar`}
      style={{ width: `${progress}%` }}
    />
    <div className={`${blockClass}__areas`}>
      {children}
    </div>
  </div>
);
