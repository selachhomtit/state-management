import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const fakeStoreApi = createApi({
    reducerPath: "fakeStoreApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com" }),
    tagTypes: ["Products"],
    refetchOnFocus: true,       // ✅ Global — applies to all endpoints
    refetchOnReconnect: true,   // ✅ Global — applies to all endpoints
    endpoints: () => ({}),
})