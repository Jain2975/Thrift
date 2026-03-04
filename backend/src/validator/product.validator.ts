import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3).max(120),
  description: z.string().max(1000).optional(),

  price: z.coerce.number().refine((val) => val > 0, {
    message: "Price must be a positive number",
  }),

  stock: z.coerce.number().int().nonnegative().max(10000).optional(),

  category: z.string().min(2).max(50).optional(),
});
