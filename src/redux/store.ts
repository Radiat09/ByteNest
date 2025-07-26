import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import filterReducer from "./features/filter/filterSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      filter: filterReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
