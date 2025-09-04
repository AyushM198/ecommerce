import { Suspense } from 'react';
import { CartContent } from '@/components/cart/CartContent';
import { CartSkeleton } from '@/components/cart/CartSkeleton';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-light-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-heading-3 font-heading text-dark-900">Shopping Cart</h1>
          <p className="mt-2 text-body text-dark-700">
            Review your items and proceed to checkout
          </p>
        </div>

        <Suspense fallback={<CartSkeleton />}>
          <CartContent />
        </Suspense>
      </div>
    </div>
  );
}
