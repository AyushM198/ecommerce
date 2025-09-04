// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import { useCartStore } from "@/store/cart";
// import { ShoppingCart } from "lucide-react";

// const NAV_LINKS = [
//   { label: "Men", href: "/products?gender=men" },
//   { label: "Women", href: "/products?gender=women" },
//   { label: "Kids", href: "/products?gender=unisex" },
//   { label: "Collections", href: "/collections" },
//   { label: "Contact", href: "/contact" },
// ] as const;

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const { getItemCount, fetchCart } = useCartStore();
//   const itemCount = getItemCount();

//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   return (
//     <header className="sticky top-0 z-50 bg-light-100">
//       <nav
//         className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
//         aria-label="Primary"
//       >
//         <Link href="/" aria-label="Nike Home" className="flex items-center">
//           <Image src="/logo.svg" alt="Nike" width={28} height={28} priority className="invert" />
//         </Link>

//         <ul className="hidden items-center gap-8 md:flex">
//           {NAV_LINKS.map((l) => (
//             <li key={l.href}>
//               <Link
//                 href={l.href}
//                 className="text-body text-dark-900 transition-colors hover:text-dark-700"
//               >
//                 {l.label}
//               </Link>
//             </li>
//           ))}
//         </ul>

//         <div className="hidden items-center gap-6 md:flex">
//           <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
//             Search
//           </button>
//           <Link
//             href="/cart"
//             className="flex items-center gap-2 text-body text-dark-900 transition-colors hover:text-dark-700"
//           >
//             <ShoppingCart className="h-5 w-5" />
//             Cart ({itemCount})
//           </Link>
//         </div>

//         <button
//           type="button"
//           className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
//           aria-controls="mobile-menu"
//           aria-expanded={open}
//           onClick={() => setOpen((v) => !v)}
//         >
//           <span className="sr-only">Toggle navigation</span>
//           <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
//           <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
//           <span className="block h-0.5 w-6 bg-dark-900"></span>
//         </button>
//       </nav>

//       <div
//         id="mobile-menu"
//         className={`border-t border-light-300 md:hidden ${open ? "block" : "hidden"}`}
//       >
//         <ul className="space-y-2 px-4 py-3">
//           {NAV_LINKS.map((l) => (
//             <li key={l.href}>
//               <Link
//                 href={l.href}
//                 className="block py-2 text-body text-dark-900 hover:text-dark-700"
//                 onClick={() => setOpen(false)}
//               >
//                 {l.label}
//               </Link>
//             </li>
//           ))}
//           <li className="flex items-center justify-between pt-2">
//             <button className="text-body">Search</button>
//             <Link
//               href="/cart"
//               className="flex items-center gap-2 text-body"
//               onClick={() => setOpen(false)}
//             >
//               <ShoppingCart className="h-5 w-5" />
//               Cart ({itemCount})
//             </Link>
//           </li>
//         </ul>
//       </div>
//     </header>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { ShoppingCart } from "lucide-react";

const NAV_LINKS = [
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Kids", href: "/products?gender=unisex" },
  { label: "Collections", href: "/collections" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { getItemCount, fetchCart } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    fetchCart();
    setHydrated(true);
  }, [fetchCart]);

  const itemCount = hydrated ? getItemCount() : 0;

  return (
    <header className="sticky top-0 z-50 bg-light-100">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Logo */}
        <Link href="/" aria-label="Nike Home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Nike"
            width={28}
            height={28}
            priority
            className="invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-body text-dark-900 transition-colors hover:text-dark-700"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-6 md:flex">
          <button className="text-body text-dark-900 transition-colors hover:text-dark-700">
            Search
          </button>
          <Link
            href="/cart"
            className="flex items-center gap-2 text-body text-dark-900 transition-colors hover:text-dark-700"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart ({itemCount})
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="mb-1 block h-0.5 w-6 bg-dark-900"></span>
          <span className="block h-0.5 w-6 bg-dark-900"></span>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`border-t border-light-300 md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <ul className="space-y-2 px-4 py-3">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2 text-body text-dark-900 hover:text-dark-700"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-between pt-2">
            <button className="text-body">Search</button>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-body"
              onClick={() => setOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              Cart ({itemCount})
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
