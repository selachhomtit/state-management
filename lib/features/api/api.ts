import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get } from "http";

export const fakeStoreApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    }),
    tagTypes: ['Products'],
    endpoints: () => ({}),
    })
