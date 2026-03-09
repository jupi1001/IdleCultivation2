/**
 * Content / navigation slice. Stores typed route; no string page.
 * Route is persisted as-is; serialization is stable (plain objects).
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentArea } from "../../enum/ContentArea";
import { RootState } from "../store";
import {
  type ContentRoute,
  parseLegacyPage,
  routeToLegacyPage,
} from "../types/contentRoute";

/** @deprecated Use ContentRoute. Legacy string page for migration only. */
export type PageValue = ContentArea | `${ContentArea.COMBAT}:${string}`;

interface ContentState {
  /** Typed route. Replaces legacy page string. */
  route: ContentRoute;
}

const initialState: ContentState = {
  route: { type: "map" },
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    changeContent: (state, action: PayloadAction<ContentRoute>) => {
      state.route = action.payload;
    },
    /** @deprecated Use changeContent with ContentRoute. Accepts legacy page string for migration. */
    changeContentLegacy: (state, action: PayloadAction<PageValue>) => {
      state.route = parseLegacyPage(action.payload);
    },
  },
});

export const { changeContent, changeContentLegacy } = contentSlice.actions;

export default contentSlice.reducer;

export const selectPage = (state: RootState) => state.content;
export const selectRoute = (state: RootState) => state.content.route;

/** Select legacy page string (for components that still compare to ContentArea). */
export const selectLegacyPage = (state: RootState) =>
  routeToLegacyPage(state.content.route);

export { routeFromArea, routeForSkillName } from "../types/contentRoute";
