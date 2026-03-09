/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Inventory } from "./Inventory";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { createMockState } from "../../test-utils";

describe("Inventory container", () => {
  it("shows empty state when there are no items", () => {
    const state = createMockState({});
    renderWithProviders(<Inventory />, { preloadedState: state });
    expect(screen.getByText("Inventory")).toBeInTheDocument();
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("renders items when inventory has entries", () => {
    const state = createMockState({});
    // Inventory selector resolves from itemsById + ITEMS_BY_ID; use a known id from data.
    (state.inventory.itemsById as any) = { 301: 2 };
    renderWithProviders(<Inventory />, { preloadedState: state });
    expect(screen.queryByText("Empty")).toBeNull();
    expect(screen.getByText(/×2/)).toBeInTheDocument();
  });
});

