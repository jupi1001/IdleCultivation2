import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ContentState {
  page: string;
}

const initialState: ContentState = {
  page: "Main",
};

export const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    changeContent: (state, action: PayloadAction<string>) => {
      state.page = action.payload;
    },
  },
});

export const { changeContent } = contentSlice.actions;

export default contentSlice.reducer;

export const selectPage = (state: RootState) => state.content;
