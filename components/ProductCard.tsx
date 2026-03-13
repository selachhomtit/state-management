"use client";

import { useGetProductsQuery } from "@/lib/features/products/productApi";

export default function ProductCard() {
  const { data = [], isLoading, isError, isFetching } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center text-gray-500">
        Loading products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center text-red-600">
        Failed to load products.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-md mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            All Products
          </h2>
          {isFetching && (
            <span className="text-xs text-blue-500 animate-pulse">Refreshing...</span>
          )}
        </div>

        {data.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No products found.
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0].startsWith("http") ? product.images[0] : `https://api.escuelajs.co${product.images[0]}`}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/64?text=?";
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    #{product.id} • {product.category?.name || "—"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-green-700 whitespace-nowrap">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}