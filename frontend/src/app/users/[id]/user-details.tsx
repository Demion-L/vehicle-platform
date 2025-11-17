"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
}

export default function UserDetails({ user }: any) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_VEHICLE_SERVICE_URL}/vehicles/user/${user.id}`
        );
        const data = await res.json();
        setVehicles(data);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, [user.id]);

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}

          {!loading && vehicles.length === 0 && (
            <p className="text-gray-500">This user has no vehicles.</p>
          )}

          <div className="space-y-4">
            {vehicles.map((v) => (
              <Card key={v.id}>
                <CardContent className="py-3">
                  <p><strong>Make:</strong> {v.make}</p>
                  <p><strong>Model:</strong> {v.model}</p>
                  <p><strong>Year:</strong> {v.year}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
