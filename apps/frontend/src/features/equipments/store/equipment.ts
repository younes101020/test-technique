import type { UpsertEquipment } from "api/types";

import { Store } from "@tanstack/react-store";

export type EquipmentUpsertDetailDialogStore = UpsertEquipment & { isDialogOpen: boolean; equipmentTypeId?: number | null };

const initialEquipmentDetails = {
  id: undefined,
  equipmentTypeId: undefined,
  name: "",
  model: "",
  brand: "",
};

export const equipmentUpsertDetailStore = new Store<EquipmentUpsertDetailDialogStore>({
  ...initialEquipmentDetails,
  isDialogOpen: false,
});

export function closeEquipmentUpsertDialog() {
  equipmentUpsertDetailStore.setState(() => {
    return { ...initialEquipmentDetails, isDialogOpen: false };
  });
}

export function initEquipmentUpsertDialog(equipmentDetails: Omit<EquipmentUpsertDetailDialogStore, "isDialogOpen">) {
  equipmentUpsertDetailStore.setState(() => {
    return { ...equipmentDetails, isDialogOpen: true };
  });
}

export const equipmentDialogStore = new Store({
  isDialogOpen: false,
});

export function closeEquipmentDialog() {
  equipmentDialogStore.setState(() => {
    return { ...initialEquipmentDetails, isDialogOpen: false };
  });
}

export function displayEquipmentDialog() {
  equipmentDialogStore.setState((prev) => {
    return { ...prev, isDialogOpen: true };
  });
}

export function updateSelectedEquipmentType(equipmentTypeId: number) {
  equipmentUpsertDetailStore.setState((prev) => {
    return { ...prev, equipmentTypeId };
  });
}

export interface EquipmentDeleteDetailDialogStore { isDialogOpen: boolean; id: number }

export const equipmentDeleteDetailStore = new Store<EquipmentDeleteDetailDialogStore>({
  isDialogOpen: false,
  id: 0,
});

export function initEquipmentDeleteDialog(equipmentId: number) {
  equipmentDeleteDetailStore.setState(() => {
    return { id: equipmentId, isDialogOpen: true };
  });
}

export function closeEquipmentDeleteDialog() {
  equipmentDeleteDetailStore.setState((prev) => {
    return { ...prev, isDialogOpen: false };
  });
}
