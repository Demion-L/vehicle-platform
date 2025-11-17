"use client";

import useSWR from "swr";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function UsersPage() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/users`,
    fetcher
  );

  if (error) {
    return (
      <div className="text-red-500 max-w-xl mx-auto mt-20">
        <h2 className="text-xl font-semibold">Failed to load users</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-9 w-36 mt-3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Users List */}
      {!isLoading &&
        data?.map((user: any) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <Link href={`/users/${user.id}`}>
                <Button variant="secondary">View Vehicles</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
