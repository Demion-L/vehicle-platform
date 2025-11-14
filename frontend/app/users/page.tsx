"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function UsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/users");
      return res.data;
    },
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link
          href="/users/new"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          + New User
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}

      <ul className="space-y-3">
        {data?.map((user: any) => (
          <li key={user.id} className="p-4 bg-gray-800 rounded">
            <p className="font-semibold">{user.email}</p>
            <p className="text-gray-400">ID: {user.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
