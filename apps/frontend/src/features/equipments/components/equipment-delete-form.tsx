import type { Equipments } from "api/types";
import type { FormEvent } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";

import { Button } from "@/components/ui/button";
import { Route } from "@/routes";

import { equipmentKeys, removeEquipment } from "../lib/queries";
import { getFilterPair } from "../lib/utils";
import { closeEquipmentDeleteDialog, equipmentDeleteDetailStore } from "../store/equipment";

interface FormElements extends HTMLFormControlsCollection {
  equipmentId: HTMLInputElement;
}
interface EquipmentIdFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export function EquipmentDeleteForm() {
  const equipmentId = useStore(equipmentDeleteDetailStore, equipmentDetail => equipmentDetail.id);
  const queryClient = useQueryClient();
  const searchParams = Route.useSearch();

  const mutation = useMutation({
    mutationFn: removeEquipment,
    mutationKey: equipmentKeys.delete,
    onMutate: async (deletedEquipment) => {
      const { model, brand } = searchParams;
      const { filteredKey, filteredValue } = getFilterPair({ model, brand });
      const queryKey = equipmentKeys.list({ ...searchParams, filteredKey, filteredValue });

      await queryClient.cancelQueries({ queryKey });
      const previousEquipmentList = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: Equipments) => ({
        ...old,
        equipments: old.equipments.filter(equipment => equipment.id.toString() !== deletedEquipment),
      }));

      return { previousEquipmentList, queryKey };
    },
    onError: (err, data, ctx) => {
      console.log(err, data)
      closeEquipmentDeleteDialog();
      if (ctx?.queryKey)
        queryClient.setQueryData(ctx.queryKey, ctx.previousEquipmentList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      closeEquipmentDeleteDialog();
    },
  });

  const handleSubmit = (e: FormEvent<EquipmentIdFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const equipmentIdValue = e.currentTarget.elements.equipmentId.value;
    mutation.mutate(equipmentIdValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="equipmentId" type="hidden" value={equipmentId} />
      <Button variant="destructive" type="submit">Confirm</Button>
    </form>
  );
}
