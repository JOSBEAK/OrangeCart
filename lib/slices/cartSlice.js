import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await fetch("https://dummyjson.com/carts/1");
  return response.json();
});

const initialState = {
  items: [],
  total: 0,
  discount: 0,
  discountedTotal: 0,
  address: {},
  status: "idle",
  error: null,
  paymentMethod: null,
  isPaymentDone: false,
  isAddressAdded: false,
  activeStep: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    applyDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
      state.isAddressAdded = true;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      state.isPaymentDone = true;
    },
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
    },
    resetCart: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.discountedTotal = action.payload.discountedTotal;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  applyDiscount,
  setAddress,
  setPaymentMethod,
  resetCart,
  setActiveStep,
} = cartSlice.actions;

export default cartSlice.reducer;
