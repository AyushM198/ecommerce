import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-12">
      {/* Top Section */}
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Logo */}
        <div>
          <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Featured</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Air Force 1</Link></li>
            <li><Link href="/">Huarache</Link></li>
            <li><Link href="/">Air Max 90</Link></li>
            <li><Link href="/">Air Max 95</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Shoes</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">All Shoes</Link></li>
            <li><Link href="/">Custom Shoes</Link></li>
            <li><Link href="/">Jordan Shoes</Link></li>
            <li><Link href="/">Running Shoes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Clothing</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">All Clothing</Link></li>
            <li><Link href="/">Modest Wear</Link></li>
            <li><Link href="/">Hoodies & Pullovers</Link></li>
            <li><Link href="/">Shirts & Tops</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Kids</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Infant & Toddler Shoes</Link></li>
            <li><Link href="/">Kids Shoes</Link></li>
            <li><Link href="/">Kids Jordan Shoes</Link></li>
            <li><Link href="/">Kids Basketball Shoes</Link></li>
          </ul>
        </div>
      </div>

      {/* Social */}
      <div className="container mx-auto flex justify-end gap-4 px-6 py-6">
        <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <Twitter size={18} />
        </Link>
        <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <Facebook size={18} />
        </Link>
        <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <Instagram size={18} />
        </Link>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 px-6">
          <p>🌍 Croatia © 2025 Nike, Inc. All Rights Reserved</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="/">Guides</Link>
            <Link href="/">Terms of Sale</Link>
            <Link href="/">Terms of Use</Link>
            <Link href="/">Nike Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
