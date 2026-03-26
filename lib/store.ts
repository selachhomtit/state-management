import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './features/counter/counterSlice'
import { productApi } from './features/products/product-api'
import { setupListeners } from "@reduxjs/toolkit/query"

export const makeStore = () => {
    return configureStore({
        reducer: {
            counter: counterSlice,
            [productApi.reducerPath]: productApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(productApi.middleware),
    })
}

// ✅ Create a store instance and export it
export const store = makeStore()

// ✅ Call setupListeners on the actual store instance
setupListeners(store.dispatch)

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']