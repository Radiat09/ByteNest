import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  discount: number;
  cartTotal: number;
  discountedCartTotal: number;
}

const initialState: CartState = {
  discount: 0,
  cartTotal: 0,
  discountedCartTotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartTotal: (state, action: PayloadAction<number>) => {
      state.cartTotal = action.payload;
    },
    setDiscount: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    setDiscountedCartTotal: (state, action: PayloadAction<number>) => {
      state.discountedCartTotal = action.payload;
    },
  },
});

export const { setCartTotal, setDiscount, setDiscountedCartTotal } = cartSlice.actions;
export default cartSlice.reducer;
