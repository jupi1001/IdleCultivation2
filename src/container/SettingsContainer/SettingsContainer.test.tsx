/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { SettingsContainer } from "./SettingsContainer";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { createMockState } from "../../test-utils";

describe("SettingsContainer", () => {
  it("renders save info and toggles death penalty mode", () => {
    const state = createMockState({});
    state.character.realm = "Qi Condensation";
    state.character.realmLevel = 1;
    state.reincarnation.reincarnationCount = 2;
    state.character.lastActiveTimestamp = 1_000_000;

    const { store } = renderWithProviders(<SettingsContainer />, { preloadedState: state });

    expect(screen.getByText(/Settings/)).toBeInTheDocument();
    expect(screen.getByText(/Realm:/)).toBeInTheDocument();

    const select = screen.getByLabelText("Death penalty mode") as HTMLSelectElement;
    expect(select.value).toBe("normal");

    fireEvent.change(select, { target: { value: "casual" } });
    const newState = store.getState();
    expect(newState.settings.deathPenaltyMode).toBe("casual");
  });

  it("shows and updates auto-eat controls when unlocked", () => {
    const state = createMockState({});
    state.settings.autoEatUnlocked = true;
    state.settings.autoEat = true;
    state.settings.autoEatHpPercent = 40;

    const { store } = renderWithProviders(<SettingsContainer />, { preloadedState: state });

    const checkbox = screen.getByLabelText("Auto-Eat (combat)") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);

    const input = screen.getByLabelText("Auto-eat HP percent") as HTMLInputElement;
    expect(input.value).toBe("40");

    fireEvent.change(input, { target: { value: "50" } });
    const newState = store.getState();
    expect(newState.settings.autoEatHpPercent).toBe(50);
  });
});

