import { describe, it, expect } from "vitest";
import contentReducer, { changeContent, changeContentLegacy } from "./contentSlice";
import type { PageValue } from "./contentSlice";

describe("contentSlice", () => {
  it("returns initial route when called with undefined", () => {
    const state = contentReducer(undefined, { type: "unknown" });
    expect(state.route).toEqual({ type: "map" });
  });

  it("changeContent updates the typed route", () => {
    const state = contentReducer(undefined, changeContent({ type: "combat", area: "Farm" }));
    expect(state.route).toEqual({ type: "combat", area: "Farm" });
  });

  it("changeContentLegacy migrates legacy page string to route", () => {
    const legacyPage: PageValue = "map";
    const state = contentReducer(undefined, changeContentLegacy(legacyPage));
    expect(state.route).toEqual({ type: "map" });
  });
});

