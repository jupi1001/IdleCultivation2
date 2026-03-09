/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { StatsContainer } from "./StatsContainer";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { createMockState } from "../../test-utils";

describe("StatsContainer", () => {
  it("renders aggregated stats and area breakdown", () => {
    const state = createMockState({});
    state.stats = {
      enemiesKilledByArea: { FARM: 5, CAVE: 2 },
      itemsGatheredFishing: 1,
      itemsGatheredMining: 2,
      itemsGatheredGathering: 3,
      totalSpiritStonesEarned: 100,
      totalQiGenerated: 200,
      totalBreakthroughs: 1,
      timePlayedMs: 3600_000,
      highestRealmStep: 11,
      itemsCraftedAlchemy: 1,
      itemsCraftedForging: 2,
      itemsCraftedCooking: 3,
      deaths: 0,
    };

    renderWithProviders(<StatsContainer />, { preloadedState: state });

    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByText("Total enemies killed").nextSibling?.textContent).toBe("7");
    expect(screen.getByText("Items gathered (total)").nextSibling?.textContent).toBe("6");
    expect(screen.getByText("Items crafted (total)").nextSibling?.textContent).toBe("6");
    // Area breakdown rows
    expect(screen.getByText("FARM")).toBeInTheDocument();
    expect(screen.getByText("CAVE")).toBeInTheDocument();
  });
});

