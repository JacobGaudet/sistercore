import React from "react";
import { notFound } from "next/navigation";
import { PRODUCTS, type Product } from "@/lib/products";
import ProductClient from "./ProductClient";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);

  const product = PRODUCTS.find((p) => p.slug === slug && p.active);
  if (!product) return notFound();

  return <ProductClient product={product as Product} />;
}
