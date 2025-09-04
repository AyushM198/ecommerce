"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

export function CartContent() {
  const { items, total, fetchCart, loading, error } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return <p>Loading cart...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div>
        <CartSummary total={total} />
      </div>
    </div>
  );
}
