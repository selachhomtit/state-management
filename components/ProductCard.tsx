"use client";

import {
  useAddProductMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
} from "@/lib/features/products/productApi";

export default function ProductCard() {
  const { data: products, isLoading, isError } = useGetProductsQuery();

  const { data: product } = useGetProductByIdQuery(1);

  const [addProduct] = useAddProductMutation();

  console.log("All Products:", products);
  console.log("Single Product:", product);

  const handleAddProduct = async () => {
    try {
      const res = await addProduct({
        title: "New Product",
        price: 50,
        description: "Test product",
        category: "electronics",
        image: "https://i.pravatar.cc", // fix: image not images
      }).unwrap();

      console.log("Product Added:", res);
    } catch (err) {
      console.error("Add Product Error:", err);
    }
  };

  if (isLoading) return <p style={{ padding: 20 }}>Loading products...</p>;

  if (isError) return <p style={{ padding: 20 }}>Failed to load products</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>Product List</h1>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
          gap: 20,
        }}
      >
        {products?.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <img
              src={item.image} // fix
              alt={item.title}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 10,
              }}
            />

            <h3 style={{ fontSize: 16 }}>{item.title}</h3>

            <p style={{ fontWeight: "bold", color: "#0a7" }}>
              ${item.price}
            </p>
          </div>
        ))}
      </div>

      <hr style={{ margin: "40px 0" }} />

      {/* SINGLE PRODUCT */}
      {product && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            maxWidth: 400,
          }}
        >
          <h2>Single Product</h2>

          <img
            src={product.image} // fix
            width={200}
            style={{ borderRadius: 10 }}
            alt={product.title}
          />

          <h3>{product.title}</h3>
          <p>${product.price}</p>
        </div>
      )}

      <button
        onClick={handleAddProduct}
        style={{
          marginTop: 30,
          padding: "10px 20px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Add Product
      </button>
    </div>
  );
}