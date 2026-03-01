import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentArea } from "../../enum/ContentArea";
import { RootState } from "../store";

/** Page value: any ContentArea, or "Combat:<areaName>" for combat routing. */
export type PageValue = ContentArea | `${ContentArea.COMBAT}:${string}`;

interface ContentState {
  page: PageValue;
}

const initialState: ContentState = {
  page: ContentArea.MAP,
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    changeContent: (state, action: PayloadAction<PageValue>) => {
      state.page = action.payload;
    },
  },
});

export const { changeContent } = contentSlice.actions;

export default contentSlice.reducer;

export const selectPage = (state: RootState) => state.content;
