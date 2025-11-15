"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function VehiclesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4001/vehicles");
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Link
          href="/vehicles/new"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          + New Vehicle
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}

      <ul className="space-y-3">
        {data?.map((v: any) => (
          <li key={v.id} className="p-4 bg-gray-800 rounded">
            <p className="font-semibold">
              {v.make} {v.model}
            </p>
            <p className="text-gray-400">User ID: {v.user_id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
