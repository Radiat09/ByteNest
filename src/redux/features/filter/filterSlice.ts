import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchText: string;
  page: number;
  limit: number;
  categories: string;
}

const initialState: FilterState = {
  searchText: "",
  page: 0,
  limit: 30,
  categories: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setCategories: (state, action: PayloadAction<string>) => {
      state.categories = action.payload;
      state.page = 0;
    },
  },
});

export const { setSearchText, setPage, setLimit, setCategories } = filterSlice.actions;
export default filterSlice.reducer;
