import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: () => true,
  effect: (action, listenerApi) => {
    sessionStorage.setItem(
      "reduxState",
      JSON.stringify(listenerApi.getState())
    );
  },
});

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export { store };
