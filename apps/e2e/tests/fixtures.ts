import type { Equipment } from "api/types";

import { faker } from "@faker-js/faker";
import { test as base } from "@playwright/test";

type UserEquipment = Pick<Equipment, "name" | "brand" | "model">;

export const test = base.extend<{ equipment: UserEquipment }>({
  // eslint-disable-next-line no-empty-pattern
  equipment: async ({}, use) => use({
    name: faker.book.title(),
    brand: faker.book.author(),
    model: faker.internet.mac(),
  }),

});
