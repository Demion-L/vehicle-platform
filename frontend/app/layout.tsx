import React from "react";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/NavBar";


export const metadata = {
  title: "Vehicle Platform",
  description: "Users & Vehicles management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">
        <Providers>
          <Navbar />
          <main className="p-6 max-w-5xl mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
