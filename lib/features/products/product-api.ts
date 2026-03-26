import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ProductResponse } from "@/lib/types/product-type"

export interface CreateProductRequest {
  title: string
  price: number
  categoryId: number
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json")
      return headers
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductResponse[], void>({
      query: () => "products",
      providesTags: [{ type: "Product", id: "LIST" }],
    }),

    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `products/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Product", id }],
    }),

    createProduct: builder.mutation<ProductResponse, CreateProductRequest>({
      query: (body) => ({
        url: "products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    updateProduct: builder.mutation<ProductResponse, UpdateProductRequest>({
      query: ({ id, ...body }) => ({
        url: `products/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi