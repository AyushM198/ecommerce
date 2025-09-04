import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const jost = Jost( {
variable: '--font-jost', subsets: ['latin'],
})
export const metadata: Metadata = {
title: "Nike",
description: "An e-commerce platform for Nike shoes!",
};

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jost.className}>
          <Navbar />
          {children}
          <Footer />
      </body>
    </html>
  );
}
