import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

// Create the listener middleware
const listenerMiddleware = createListenerMiddleware();

// Add a listener that will be called after every action
listenerMiddleware.startListening({
  predicate: () => true, // This ensures the listener runs for every action
  effect: (action, listenerApi) => {
    localStorage.setItem("reduxState", JSON.stringify(listenerApi.getState()));
  },
});

// Function to load the persisted state
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Create the store with the persisted state
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: loadState(), // Load the persisted state
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export { store };
