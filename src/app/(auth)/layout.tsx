import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 bg-black text-white flex-col items-center justify-center p-10">
        <div className="max-w-md space-y-6 text-center">
          <img src="/logo.svg" alt="Logo" className="h-10 mx-auto" />
          <h1 className="text-3xl font-bold">Just Do It</h1>
          <p className="text-gray-300">
            Join millions of athletes and fitness enthusiasts who trust us for
            their performance needs.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
