import type { StandardSchemaV1Issue } from "@tanstack/react-form";
import type { Equipments } from "api/types";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { equipmentUpdateDetailSchema } from "api/schema";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { closeEquipmentUpsertDialog, equipmentUpsertDetailStore } from "@/features/equipments/store/equipment";
import { Route } from "@/routes";

import { editEquipment, equipmentKeys } from "../lib/queries";
import { getFilterPair } from "../lib/utils";
import { EquipmentTypesTreeSelect } from "./equipments-types-tree-select";

export function EquipmentForm() {
  const searchParams = Route.useSearch();
  const [isEquipmentTypeIdError, setIsEquipmentTypeIdError] = useState(false);
  const defaultEquipmentDetails = useStore(equipmentUpsertDetailStore, (equipmentDetail) => {
    const { isDialogOpen, ...equipmentDetailData } = equipmentDetail;
    return equipmentDetailData;
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editEquipment,
    mutationKey: equipmentKeys.edit,
    onMutate: async (editedEquipment) => {
      closeEquipmentUpsertDialog();
      const { model, brand } = searchParams;
      const { filteredKey, filteredValue } = getFilterPair({ model, brand });
      const queryKey = equipmentKeys.list({ ...searchParams, filteredKey, filteredValue });

      await queryClient.cancelQueries({ queryKey });
      const previousEquipmentList = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old: Equipments) => ({
        ...old,
        equipments: old.equipments.map((equipment) => {
          if (equipment.id === editedEquipment.id) {
            return editedEquipment;
          }
          return equipment;
        }),
      }));

      return { previousEquipmentList, queryKey };
    },
    onError: (err, data, ctx) => {
      console.log(err, data);
      closeEquipmentUpsertDialog();
      if (ctx?.queryKey)
        queryClient.setQueryData(ctx.queryKey, ctx.previousEquipmentList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      closeEquipmentUpsertDialog();
    },
  });

  const form = useForm({
    defaultValues: {
      brand: defaultEquipmentDetails.brand,
      model: defaultEquipmentDetails.model,
    },
    validators: {
      onChange: equipmentUpdateDetailSchema,
    },
    onSubmit: async ({ value }) => {
      if (!defaultEquipmentDetails.equipmentTypeId) {
        setIsEquipmentTypeIdError(true);
      }
      else {
        mutation.mutate({
          ...value,
          name: defaultEquipmentDetails.name,
          equipmentTypeId: defaultEquipmentDetails.equipmentTypeId,
          id: defaultEquipmentDetails.id!,
        });
      }
      if (isEquipmentTypeIdError && defaultEquipmentDetails.equipmentTypeId)
        setIsEquipmentTypeIdError(false);
    },
  });

  const validationError = form.state.errorMap.onChange && form.state.errorMap.onChange[""];
  const isValidationError = Boolean(validationError || isEquipmentTypeIdError);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid gap-4 mt-4"
    >
      {isValidationError && <FormError issues={validationError} />}
      <form.Field
        name="brand"
        children={field => (
          <div className="grid gap-3">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />
      <form.Field
        name="model"
        children={field => (
          <div className="grid gap-3">
            <Label htmlFor="model">Model</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />
      <div className="grid gap-3">
        <Label htmlFor="model">Type</Label>
        <ScrollArea className="max-h-72">
          <EquipmentTypesTreeSelect />
        </ScrollArea>
      </div>
      {form.state.errorMap.onChange && form.state.errorMap.onChange[""] && <FormError issues={form.state.errorMap.onChange[""]} />}
      <div className="flex gap-3">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <form.Subscribe
          selector={state => [state.canSubmit]}
          children={([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit}>
              Save changes
            </Button>
          )}
        />
      </div>
    </form>
  );
}

function FormError({ issues }: { issues?: StandardSchemaV1Issue[] }) {
  if (!issues)
    return <p className="border text-xs rounded p-2">You need to choose equipment type</p>;

  return (
    <>
      {issues.map(issue => (
        <p key={issue.message} className="border text-xs rounded p-2">{issue.message}</p>
      ))}
    </>
  );
}
