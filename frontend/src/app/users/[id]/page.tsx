import { notFound } from "next/navigation";
import UserDetails from "./user-details";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserPage({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/users/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return notFound();

  const user = await res.json();

  return <UserDetails user={user} />;
}
