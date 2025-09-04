"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";

interface CartSummaryProps {
  total: number;
}

export default function CartSummary({ total }: CartSummaryProps) {
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="sticky top-4 rounded-lg border border-light-300 bg-white p-6">
      <h2 className="text-heading-3 font-heading text-dark-900 mb-4">
        Order Summary
      </h2>

      <div className="space-y-2">
        <div className="flex justify-between text-body">
          <span>Items ({itemCount})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-body">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-body">
          <span>Tax</span>
          <span>${(total * 0.08).toFixed(2)}</span>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between text-body-medium font-medium">
          <span>Total</span>
          <span>${(total * 1.08).toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="mt-6 block w-full rounded-md bg-dark-900 px-4 py-3 text-center text-body-medium font-medium text-white hover:bg-dark-800"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="mt-4 block text-center text-body text-dark-700 hover:text-dark-900"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
