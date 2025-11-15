"use client";

import React from "react"
import { FieldError } from "react-hook-form";

export default function Input({
  label,
  error,
  ...props
}: {
  label: string;
  error?: FieldError;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className="px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
      />
      {error && <p className="text-red-400 text-sm">{error.message}</p>}
    </div>
  );
}
