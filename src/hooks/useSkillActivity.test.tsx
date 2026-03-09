/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { createMockState } from "../test-utils";
import { useSkillActivity, type SkillLevelInfo } from "./useSkillActivity";
import type { FishingAreaI } from "../interfaces/FishingAreaI";

function TestFishingSkillActivity() {
  const areas: FishingAreaI[] = [
    {
      id: 1,
      name: "Beginner Pond",
      picture: "/pond.webp",
      altText: "Pond",
      xp: 1,
      xpUnlock: 0,
      delay: 1000,
      fishingLootIds: [301],
    },
    {
      id: 2,
      name: "Reincarnation Lake",
      picture: "/lake.webp",
      altText: "Lake",
      xp: 2,
      xpUnlock: 0,
      delay: 1500,
      fishingLootIds: [302],
      requiresReincarnation: true,
    },
  ];

  const getLevelInfo = (xp: number): SkillLevelInfo => ({
    level: 1,
    xpInLevel: xp,
    xpRequiredForNext: 10,
  });

  const result = useSkillActivity<"fishing", FishingAreaI>({
    kind: "fishing",
    areaData: areas,
    getLevelInfo,
    maxLevel: 99,
  });

  return (
    <div data-testid="visible">
      {result.areasVisible.map((a) => a.id).join(",")}
    </div>
  );
}

describe("useSkillActivity", () => {
  it("filters areasVisible based on requiresReincarnation flag and reincarnation count", () => {
    // Reincarnation 0: only non-gated area visible.
    const state0 = createMockState({});
    state0.reincarnation.reincarnationCount = 0;
    const { getByTestId: getByTestId0, unmount } = renderWithProviders(<TestFishingSkillActivity />, {
      preloadedState: state0,
    });
    expect(getByTestId0("visible").textContent).toBe("1");
    unmount();

    // Reincarnation 1: both areas visible.
    const state1 = createMockState({});
    state1.reincarnation.reincarnationCount = 1;
    const { getByTestId: getByTestId1 } = renderWithProviders(<TestFishingSkillActivity />, {
      preloadedState: state1,
    });
    expect(getByTestId1("visible").textContent).toBe("1,2");
  });
});

