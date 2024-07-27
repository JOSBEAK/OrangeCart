import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// export const persistor = persistStore(store);
