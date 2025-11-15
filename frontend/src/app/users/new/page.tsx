"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserFormData } from "@/schemas/user.schema";
import Input from "@/components/UI/Input";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function NewUserPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    await axios.post("http://localhost:4000/users", data);
    router.push("/users");
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create New User</h1>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" {...register("email")} error={errors.email} />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password}
        />

        <button
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
