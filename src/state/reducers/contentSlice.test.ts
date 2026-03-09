import { describe, it, expect } from "vitest";
import contentReducer, { changeContent, changeContentLegacy } from "./contentSlice";
import type { PageValue } from "./contentSlice";
import { ContentArea } from "../../enum/ContentArea";

describe("contentSlice", () => {
  it("returns initial route when called with undefined", () => {
    const state = contentReducer(undefined, { type: "unknown" });
    expect(state.route).toEqual({ type: "map" });
  });

  it("changeContent updates the typed route", () => {
    const state = contentReducer(
      undefined,
      changeContent({ type: "combat", areaId: "Farm" }),
    );
    expect(state.route).toEqual({ type: "combat", areaId: "Farm" });
  });

  it("changeContentLegacy migrates legacy page string to route", () => {
    const legacyPage: PageValue = ContentArea.MAP;
    const state = contentReducer(undefined, changeContentLegacy(legacyPage));
    expect(state.route).toEqual({ type: "map" });
  });
});

