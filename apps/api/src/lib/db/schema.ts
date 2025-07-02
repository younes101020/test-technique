import type { AnyPgColumn } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const equipmentTypes = pgTable("equipment_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  parentId: integer("parent_id").references((): AnyPgColumn => equipmentTypes.id),
  level: text({ enum: ["domain", "type", "category", "subcategory"] }),
});

export const equipments = pgTable("equipments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  equipmentTypeId: integer("equipment_type_id").references(() => equipmentTypes.id),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
});

export const equipmentTypesRelations = relations(equipmentTypes, ({ one, many }) => ({
  parent: one(equipmentTypes, {
    fields: [equipmentTypes.parentId],
    references: [equipmentTypes.id],
    relationName: "parent_child",
  }),
  children: many(equipmentTypes, {
    relationName: "parent_child",
  }),
  equipments: many(equipments),
}));

export const equipmentsRelations = relations(equipments, ({ one }) => ({
  equipmentType: one(equipmentTypes, {
    fields: [equipments.equipmentTypeId],
    references: [equipmentTypes.id],
  }),
}));
