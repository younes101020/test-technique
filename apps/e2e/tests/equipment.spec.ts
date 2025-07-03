import { expect } from "@playwright/test";

import { test } from "./fixtures";

const PROD_URL = "http://localhost:8787";

test.beforeEach(async ({ page }) => {
  await page.goto(PROD_URL);
});

test("edit existing equipment", async ({ page, equipment }) => {
  const equipmentOptionsDropdown = page.getByTestId("equipment-options").first();

  // Open dialog form
  await equipmentOptionsDropdown.click();
  await page.getByTestId("equipment-edit").click();

  // fill edition form
  await page.getByLabel("Brand").fill(equipment.brand);
  await page.getByLabel("Model").fill(equipment.model);
  await page.getByText("Save changes").press("Enter");

  // Re open the same dialog open
  await equipmentOptionsDropdown.click();
  await page.getByTestId("equipment-edit").click();

  // Expect the equipment to be updated
  await expect(page.getByLabel("Brand")).toHaveValue(equipment.brand);
  await expect(page.getByLabel("Model")).toHaveValue(equipment.model);
});
