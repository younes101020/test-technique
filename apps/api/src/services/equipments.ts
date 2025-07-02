import { asc, desc, eq, sql } from "drizzle-orm";

import type { EquipmentSearchParam, UpsertEquipment } from "../lib/types";

import { db } from "../lib/db/client";
import { equipments, equipmentTypes } from "../lib/db/schema";
import { getPaginationQuery, getSearchQuery, reverseTree } from "../lib/utils";

export function deleteEquipment(id: number) {
  return db.delete(equipments).where(eq(equipments.id, id)).returning();
}

export async function getEquipmentsTypesTree() {
  const equipmentsTypeWithParents = await db.query.equipmentTypes.findMany({
    where: eq(equipmentTypes.level, "subcategory"),
    with: {
      parent: {
        with: {
          parent: {
            with: {
              parent: true,
            },
          },
        },
      },
    },
  });

  return equipmentsTypeWithParents.map(reverseTree);
}

export async function createEquipments(updatedDetails: UpsertEquipment) {
  return db.insert(equipments).values(updatedDetails);
}

export async function upsertEquipments(updatedDetails: UpsertEquipment & { id: number }) {
  return db.insert(equipments)
    .values(updatedDetails)
    .onConflictDoUpdate({
      target: equipments.id,
      set: {
        name: sql.raw(`excluded.${equipments.name.name}`),
        brand: sql.raw(`excluded.${equipments.brand.name}`),
        model: sql.raw(`excluded.${equipments.model.name}`),
        equipmentTypeId: sql.raw(`excluded.${equipments.equipmentTypeId.name}`),
      },
    });
}

export async function getEquipments(equipmentSearchParam: EquipmentSearchParam) {
  return db.transaction(async (tx) => {
    const { model, brand, limit, dir, category, subCategory, domain, type } = equipmentSearchParam;

    const paginationQuery = getPaginationQuery(equipmentSearchParam);
    const searchQuery = getSearchQuery({ model, brand });
    const shouldFilter = Boolean(domain || category || subCategory || type);
    const equipmentsWithType = await tx.query.equipments.findMany({
      with: {
        equipmentType: true,
      },
      orderBy: dir === "prev" ? desc(equipments.id) : asc(equipments.id),
      limit: limit + 1,
      where: brand || model ? searchQuery : paginationQuery,
    });

    const isBackward = dir === "prev" && equipmentsWithType.length > 0;

    const hasMore = equipmentsWithType.length > limit;
    const isStart = dir === "prev" && !hasMore;
    const isEnd = dir === "next" && !hasMore;

    const equipmentsResult = hasMore ? equipmentsWithType.slice(0, -1) : equipmentsWithType;

    if (isBackward)
      equipmentsResult.reverse();

    const nextCursor = hasMore || isStart ? equipmentsResult[equipmentsResult.length - 1].id : undefined;
    const prevCursor = equipmentsResult.length > 0 ? equipmentsResult[0].id : undefined;

    const equipmentTypeGroup = await tx.query.equipmentTypes.findMany();

    const equipmentsPage = await Promise.all(
      equipmentsResult.map(async (equipment) => {
        const equipmentTypeTree = await tx.query.equipmentTypes.findFirst({
          where: eq(equipmentTypes.id, equipment.equipmentType?.id || 0),
          with: {
            // category
            parent: {
              with: {
                // type
                parent: {
                  with: {
                    // domain
                    parent: true,
                  },
                },
              },
            },
          },
        });

        const domainNodeName = equipmentTypeTree?.parent?.parent?.parent?.name;
        const typeNodeName = equipmentTypeTree?.parent?.parent?.name;
        const categoryNodeName = equipmentTypeTree?.parent?.name;
        const subCategoryNodeName = equipmentTypeTree?.name;

        const equipmentTypeNames = shouldFilter
          ? {
              domain: domain === domainNodeName ? domainNodeName : undefined,
              type: type === typeNodeName ? typeNodeName : undefined,
              category: category === categoryNodeName ? categoryNodeName : undefined,
              subCategory: subCategory === subCategoryNodeName ? subCategoryNodeName : undefined,
            }
          : {
              domain: domainNodeName,
              type: typeNodeName,
              category: categoryNodeName,
              subCategory: subCategoryNodeName,
            };

        const equipmentWithflattenedType = {
          ...equipment,
          ...equipmentTypeNames,
        };

        const { equipmentType, ...withoutEquipmentTypeTree } = equipmentWithflattenedType;

        return withoutEquipmentTypeTree;
      },
      ),
    );

    return {
      equipments: shouldFilter ? equipmentsPage.filter(equipment => equipment.domain || equipment.type || equipment.category || equipment.subCategory) : equipmentsPage,
      equipmentTypes: {
        domain: equipmentTypeGroup.filter(type => type.level === "domain"),
        type: equipmentTypeGroup.filter(type => type.level === "type"),
        category: equipmentTypeGroup.filter(type => type.level === "category"),
        subCategory: equipmentTypeGroup.filter(type => type.level === "subcategory"),
      },
      nextCursor,
      prevCursor,
      isStart,
      isEnd,
    };
  });
}
