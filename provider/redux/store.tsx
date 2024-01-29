import { configureStore } from "@reduxjs/toolkit";
import { ProductApi } from "./query/Product";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [ProductApi.reducerPath]: ProductApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ProductApi.middleware),
});

setupListeners(store.dispatch);
