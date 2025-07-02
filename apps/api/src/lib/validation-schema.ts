import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { equipments } from "./db/schema";

export const equipmentUpsertSchema = createUpdateSchema(equipments).extend({ name: z.string(), brand: z.string(), model: z.string(), id: z.number() });
export const equipmentInsertSchema = createInsertSchema(equipments).omit({ id: true });

export const equipmentSearchParamsSchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  domain: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  dir: z.enum(["next", "prev"]).optional(),
}).pipe(
  z.transform(searchParams => ({
    ...searchParams,
    dir: searchParams.dir ?? "next",
    limit: searchParams.limit ?? 10,
  })),
);

export const equipmentInsertDetailSchema = createInsertSchema(equipments)
  .check((ctx) => {
    if (ctx.value.name.length < 3) {
      ctx.issues.push({
        code: "too_small",
        minimum: 3,
        origin: "string",
        message: "Equipment name is too short",
        input: ctx.value,
      });
    }

    if (ctx.value.brand.length < 3) {
      ctx.issues.push({
        code: "too_small",
        minimum: 3,
        origin: "string",
        message: "Brand name is too short",
        input: ctx.value,
      });
    }

    if (ctx.value.model.length < 3) {
      ctx.issues.push({
        code: "too_small",
        minimum: 3,
        origin: "string",
        message: "Model name is too short",
        input: ctx.value,
      });
    }
  });

export const equipmentUpdateDetailSchema = createInsertSchema(equipments)
  .pick({ brand: true, model: true })
  .check((ctx) => {
    if (ctx.value.brand.length < 3) {
      ctx.issues.push({
        code: "too_small",
        minimum: 3,
        origin: "string",
        message: "Brand name is too short",
        input: ctx.value,
      });
    }

    if (ctx.value.model.length < 3) {
      ctx.issues.push({
        code: "too_small",
        minimum: 3,
        origin: "string",
        message: "Model name is too short",
        input: ctx.value,
      });
    }
  });
