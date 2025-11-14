"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4 mb-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-xl font-bold text-blue-400">
          Vehicle Platform
        </Link>

        <div className="flex gap-6">
          <Link href="/users" className="hover:text-blue-300">
            Users
          </Link>
          <Link href="/vehicles" className="hover:text-blue-300">
            Vehicles
          </Link>
        </div>
      </div>
    </nav>
  );
}
