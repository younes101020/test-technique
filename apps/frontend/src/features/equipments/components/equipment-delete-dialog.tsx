import { useStore } from "@tanstack/react-store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { closeEquipmentDeleteDialog, equipmentDeleteDetailStore } from "@/features/equipments/store/equipment";

import { EquipmentDeleteForm } from "./equipment-delete-form";

export function EquipmentDeleteDialog() {
  const isDialogOpen = useStore(equipmentDeleteDetailStore, equipmentDetail => equipmentDetail.isDialogOpen);
  return (
    <AlertDialog open={isDialogOpen} onOpenChange={closeEquipmentDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            equipment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <EquipmentDeleteForm />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
