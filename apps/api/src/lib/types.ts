import type z from "zod/v4";

import type { getEquipments, getEquipmentsTypesTree } from "../services/equipments";
import type { equipments, equipmentTypes } from "./db/schema";
import type { equipmentSearchParamsSchema, equipmentUpsertSchema } from "./validation-schema";

export type EquipmentType = typeof equipmentTypes.$inferSelect;
export type NewEquipmentType = typeof equipmentTypes.$inferInsert;
export type UpsertEquipment = typeof equipments.$inferInsert;

export type EquipmentTypeWithParent = EquipmentType & {
  parent?: EquipmentType & { parent?: EquipmentType & { parent?: EquipmentType } };
};

export type Equipments = Awaited<ReturnType<typeof getEquipments>>;
export type Equipment = Equipments["equipments"][number];

export type EquipmentSearchParam = z.infer<typeof equipmentSearchParamsSchema>;

export type EquipmentTypeNode = EquipmentType & { parent?: EquipmentTypeNode | null; children?: EquipmentTypeNode[] };
export type EquipmentTypeNodes = Awaited<ReturnType<typeof getEquipmentsTypesTree>>;
export type EquipmentTypes = Equipments["equipmentTypes"];

export type UpdatedEquipment = z.infer<typeof equipmentUpsertSchema>;
