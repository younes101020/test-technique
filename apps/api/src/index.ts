import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { validator } from "hono/validator";
import { z } from "zod/v4";

import { equipmentInsertSchema, equipmentSearchParamsSchema, equipmentUpsertSchema } from "./lib/validation-schema";
import { createEquipments, deleteEquipment, getEquipments, getEquipmentsTypesTree, upsertEquipments } from "./services/equipments";

const app = new Hono();

app.use(logger());

app.use("/api/*", cors({ origin: ["http://localhost:3000", "http://localhost:8787"] }));

const apiRoutes = app
  .basePath("/api")
  .get("/equipments", validator("query", (value, c) => {
    const parsed = equipmentSearchParamsSchema.safeParse(value);
    if (!parsed.success) {
      return c.text(z.prettifyError(parsed.error), 400);
    }
    return parsed.data;
  }), async (c) => {
    try {
      const searchParams = c.req.valid("query");
      const equipments = await getEquipments(searchParams);
      return c.json(equipments);
    }
    catch (error) {
      return c.json(
        {
          error,
        },
        400,
      );
    }
  })
  .post("/equipments", validator("json", (value, c) => {
    const parsed = equipmentInsertSchema.safeParse(value);
    if (!parsed.success) {
      return c.text(z.prettifyError(parsed.error), 400);
    }
    return parsed.data;
  }), async (c) => {
    try {
      const equipmentToSync = c.req.valid("json");
      await createEquipments(equipmentToSync);
      return c.json({
        success: true,
      });
    }
    catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          error: "Failed to sync equipments",
        },
        500,
      );
    }
  })
  .delete("/equipments/:id", validator("param", (value, c) => {
    const parsed = z.object({ id: z.coerce.number() }).safeParse(value);
    if (!parsed.success) {
      return c.text(z.prettifyError(parsed.error), 400);
    }
    return parsed.data;
  }), async (c) => {
    try {
      const { id } = c.req.valid("param");

      const [deletedEq] = await deleteEquipment(id);

      return c.json({
        success: true,
        result: deletedEq,
      });
    }
    catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          error: "Failed to delete equipment",
        },
        500,
      );
    }
  })
  .put("/equipments", validator("json", (value, c) => {
    const parsed = equipmentUpsertSchema.safeParse(value);
    if (!parsed.success) {
      return c.text(z.prettifyError(parsed.error), 400);
    }
    return parsed.data;
  }), async (c) => {
    try {
      const equipmentToSync = c.req.valid("json");
      await upsertEquipments(equipmentToSync);
      return c.json({
        success: true,
      });
    }
    catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          error: "Failed to update equipment(s)",
        },
        500,
      );
    }
  })
  .get("/equipments/types", async (c) => {
    try {
      const equipmentsTypesTree = await getEquipmentsTypesTree();
      return c.json(equipmentsTypesTree);
    }
    catch (error) {
      return c.json(
        {
          error,
        },
        400,
      );
    }
  })
  .get("/equipments/:id/type", validator("param", (value, c) => {
    const parsed = z.object({ id: z.coerce.number() }).safeParse(value);
    if (!parsed.success) {
      return c.text(z.prettifyError(parsed.error), 400);
    }
    return parsed.data;
  }), async (c) => {
    try {
      const { id } = c.req.valid("param");

      const [deletedEq] = await deleteEquipment(id);

      return c.json({
        success: true,
        result: deletedEq,
      });
    }
    catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          error: "Failed to get equipment",
        },
        500,
      );
    }
  });

app.use("*", serveStatic({ root: "../frontend/dist" }));
app.use("*", serveStatic({ root: "../frontend/dist/index.html" }));

serve({
  fetch: app.fetch,
  port: 8787,
});

export { apiRoutes };

export default app;
