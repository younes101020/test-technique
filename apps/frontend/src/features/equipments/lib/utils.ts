import type { EquipmentSearchParam } from "api/types";

export function getFilterPair({ model, brand }: Pick<EquipmentSearchParam, "brand" | "model">) {
  return {
    filteredKey: model ? "model" : brand ? "brand" : undefined,
    filteredValue: model || (brand || undefined),
  };
}
