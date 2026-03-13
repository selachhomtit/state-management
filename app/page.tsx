"use client"
import Card from "@/components/Card";

import GetProductById from "@/components/GetProductById";
import InsertProduct from "@/components/InsertProductCard";
import ProductCard from "@/components/ProductCard";
import TextCard from "@/components/TextCard";
import Image from "next/image";

export default function Home() {
  return (
   <div>
 
        <TextCard />
        <GetProductById />
        <InsertProduct />
        <ProductCard />
    </div>
  );
}
