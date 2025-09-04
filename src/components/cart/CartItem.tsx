"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: {
    id: string;
    productVariantId: string;
    quantity: number;
    name: string;
    price: number;
    image?: string;
    size?: string;
    color?: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(item.id);
    } else {
      await updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeItem(item.id);
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-light-300 bg-white p-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-light-200" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-body-medium font-medium text-dark-900">
          {item.name}
        </h3>
        <p className="text-body text-dark-700">
          Size: {item.size} | Color: {item.color}
        </p>
        <p className="text-body text-dark-700">
          ${item.price.toFixed(2)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-light-300 hover:bg-light-200"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-body">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-light-300 hover:bg-light-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="text-right">
        <p className="text-body-medium font-medium text-dark-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
