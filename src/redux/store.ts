import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import filterReducer from "./features/filter/filterSlice";
import cartReducer from "./features/cart/cartSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      filter: filterReducer,
      cart: cartReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
