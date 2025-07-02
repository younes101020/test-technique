import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { equipmentSearchParamsSchema } from "api/schema";

import { Equipments } from "@/features/equipments";
import { equipmentsPaginationQueryOptions } from "@/features/equipments/lib/queries";

export const Route = createFileRoute("/")({
  component: Equipments,
  validateSearch: zodValidator(equipmentSearchParamsSchema),
  loaderDeps: ({ search }) => ({
    ...search,
  }),
  loader: ({ context: { queryClient }, deps }) =>
    queryClient.ensureQueryData(equipmentsPaginationQueryOptions(deps)),
});
