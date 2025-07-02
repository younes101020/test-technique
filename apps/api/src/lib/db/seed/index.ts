import { eq, sql } from "drizzle-orm";
import { seed } from "drizzle-seed";

import { db } from "../client";
import { equipments, equipmentTypes } from "../schema";
import { equipmentTypesData } from "./equipment-types-data";

async function main() {
  await db.transaction(async (tx) => {
    await Promise.all([
      seed(tx, { equipments }, { count: 20 }),
      // https://orm.drizzle.team/docs/seed-overview#limitations
      tx.insert(equipmentTypes).values(equipmentTypesData),
    ]);

    await tx.execute(
      sql`SELECT setval(pg_get_serial_sequence('equipments', 'id'), coalesce(max(id), 0) + 1, false) FROM equipments`,
    );

    const equipmentRecords = await tx.select().from(equipments);

    const equipmentSubCategories = equipmentTypesData.filter(equipmentType => equipmentType.level === "subcategory");

    // Link equipment with subcategory
    await Promise.all([
      equipmentRecords.map(async (equipment) => {
        const randomSubcategory = equipmentSubCategories[Math.floor(Math.random() * equipmentSubCategories.length)];
        return tx.update(equipments).set({ equipmentTypeId: randomSubcategory.id }).where(eq(equipments.id, equipment.id));
      },
      ),
    ]);
  });
}

main();
