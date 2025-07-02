import { useStore } from "@tanstack/react-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  closeEquipmentUpsertDialog,
  equipmentUpsertDetailStore,
} from "@/features/equipments/store/equipment";

import { EquipmentForm } from "./equipment-edit-form";

export function EquipmentEditDialog() {
  const isDialogOpen = useStore(equipmentUpsertDetailStore, equipmentDetail => equipmentDetail.isDialogOpen);
  return (
    <Dialog open={isDialogOpen} onOpenChange={closeEquipmentUpsertDialog}>
      <DialogContent className="font-display">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>
            Make changes to your equipment here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <EquipmentForm />
      </DialogContent>
    </Dialog>
  );
}
