import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.number().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().positive().optional().nullable(),
  user_id: z.number().int().positive().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type VehicleFormData = z.infer<typeof VehicleSchema>;