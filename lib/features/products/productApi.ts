import { ProductResponse } from "@/lib/types/product-type";
import { fakeStoreApi } from "../api/api";

export const productApi = fakeStoreApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET ALL PRODUCTS
    getProducts: builder.query<ProductResponse[], void>({
      query: () => "/products",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Products" as const,
                id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),

    // GET PRODUCT BY ID
    getProductById: builder.query<ProductResponse, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // ADD PRODUCT
    addProduct: builder.mutation<ProductResponse, Partial<ProductResponse>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),
  }),
});

// hooks
export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
} = productApi;