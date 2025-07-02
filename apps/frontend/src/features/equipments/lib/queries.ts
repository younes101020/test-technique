import type { EquipmentSearchParam, UpsertEquipment } from "api/types";

import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { Route } from "@/routes";

import { client } from "../../../lib/http/client";
import { getFilterPair } from "./utils";

export function useEquipments() {
  const searchParams = Route.useSearch();
  return useQuery(equipmentsPaginationQueryOptions(searchParams));
}

export function editEquipment(equipment: UpsertEquipment & { id: number }) {
  return client.api.equipments.$put({
    json: equipment,
  });
}

export function createEquipment(equipment: Omit<UpsertEquipment, "id">) {
  return client.api.equipments.$post({
    json: equipment,
  });
}

export function removeEquipment(equipmentId: string) {
  return client.api.equipments[":id"].$delete({
    param: {
      id: equipmentId,
    },
  });
}

type PaginationAndFilterSp = Omit<EquipmentSearchParam, "limit" | "brand" | "name" | "model">
  & { filteredKey?: string; filteredValue?: string };

export const equipmentKeys = {
  list: (searchParams: PaginationAndFilterSp) =>
    [
      "equipments",
      searchParams.cursor,
      searchParams.dir,
      searchParams.filteredKey,
      searchParams.filteredValue,
      {
        domain: searchParams.domain,
        type: searchParams.type,
        category: searchParams.category,
        subCategory: searchParams.subCategory,
      },
    ] as const,
  detail: (id: number) => ["equipments", id] as const,
  edit: ["edit-equipment"] as const,
  delete: ["delete-equipment"] as const,
  add: ["add-equipment"] as const,
};

export function equipmentsPaginationQueryOptions(searchParams: EquipmentSearchParam) {
  const { model, brand } = searchParams;
  const { filteredKey, filteredValue } = getFilterPair({ model, brand });
  return queryOptions({
    queryKey: equipmentKeys.list({ ...searchParams, filteredKey, filteredValue }),
    queryFn: () => client.api.equipments.$get({
      query: {
        ...searchParams,
        limit: searchParams.limit?.toString(),
        cursor: searchParams.cursor?.toString(),
      },
    }).then(data => data.json()),
    placeholderData: keepPreviousData,
  });
}

export function equipmentTypesQueryOptions() {
  return queryOptions({
    queryKey: ["equipments", "types"],
    queryFn: () => client.api.equipments.types.$get()
      .then(data => data.json()),
  });
}
