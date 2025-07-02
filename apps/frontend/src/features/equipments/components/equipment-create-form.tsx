import type { StandardSchemaV1Issue } from "@tanstack/react-form";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { equipmentInsertDetailSchema } from "api/schema";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { closeEquipmentDialog, equipmentUpsertDetailStore } from "@/features/equipments/store/equipment";

import { createEquipment, equipmentKeys } from "../lib/queries";
import { EquipmentTypesTreeSelect } from "./equipments-types-tree-select";

export function EquipmentCreateForm() {
  const [isEquipmentTypeIdError, setIsEquipmentTypeIdError] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const defaultEquipmentDetails = useStore(equipmentUpsertDetailStore, (equipmentDetail) => {
    const { isDialogOpen, ...equipmentDetailData } = equipmentDetail;
    return equipmentDetailData;
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEquipment,
    mutationKey: equipmentKeys.add,
    onError: () => {
      setIsServerError(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      closeEquipmentDialog();
    },
  });

  const form = useForm({
    defaultValues: defaultEquipmentDetails,
    validators: {
      onChange: equipmentInsertDetailSchema,
    },
    onSubmit: ({ value: formValue }) => {
      if (!defaultEquipmentDetails.equipmentTypeId) {
        setIsEquipmentTypeIdError(true);
      }
      else {
        mutation.mutate({
          ...formValue,
          equipmentTypeId: defaultEquipmentDetails.equipmentTypeId,
        });
      }
      if (isEquipmentTypeIdError && defaultEquipmentDetails.equipmentTypeId)
        setIsEquipmentTypeIdError(false);
    },
  });

  const validationError = form.state.errorMap.onChange && form.state.errorMap.onChange[""];
  const isError = Boolean(validationError || isEquipmentTypeIdError || isServerError);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="grid gap-4 mt-4"
    >
      {isError && <FormError issues={validationError} equipmentTypeIdIssue={isEquipmentTypeIdError} />}
      <form.Field
        name="name"
        children={field => (
          <div className="grid gap-3">
            <Label htmlFor="brand">Name</Label>
            <Input
              placeholder="ex: my elevator"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={e => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />
      <Separator />
      <form.Field
        name="brand"
        children={field => (
          <div className="grid gap-3">
            <Label htmlFor="brand">Brand</Label>
            <Input
              placeholder="ex: schindler"
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
              placeholder="ex: x74585"
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

function FormError({ issues, equipmentTypeIdIssue }: { issues?: StandardSchemaV1Issue[]; equipmentTypeIdIssue: boolean }) {
  if (equipmentTypeIdIssue)
    return <p className="border text-xs rounded p-2">You need to choose equipment type</p>;

  if (!issues)
    return <p className="border text-xs rounded p-2">We encountered a problem. Please try again later.</p>;

  return (
    <>
      {issues.map(issue => (
        <p key={issue.message} className="border text-xs rounded p-2">{issue.message}</p>
      ))}
    </>
  );
}
