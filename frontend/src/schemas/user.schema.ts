import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 chars"),
});

export type UserFormData = z.infer<typeof UserSchema>;
