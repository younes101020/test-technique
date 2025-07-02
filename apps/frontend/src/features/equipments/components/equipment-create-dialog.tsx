import { useStore } from "@tanstack/react-store";
import { BadgePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { closeEquipmentDialog, displayEquipmentDialog, equipmentDialogStore } from "../store/equipment";

interface EquipmentCreateDialogTriggerProps {
  children?: React.ReactNode;
}

export function EquipmentCreateDialog({ children }: EquipmentCreateDialogTriggerProps) {
  const isDialogOpen = useStore(equipmentDialogStore, equipmentDetail => equipmentDetail.isDialogOpen);
  return (
    <Dialog open={isDialogOpen} onOpenChange={closeEquipmentDialog}>

      <Button className="my-4 flex gap-2" onClick={displayEquipmentDialog}>
        <BadgePlus />
        {"|  "}
        <p>New equipment</p>
      </Button>
      <DialogContent className="font-display">
        <DialogHeader>
          <DialogTitle>Create new equipment</DialogTitle>
          <DialogDescription>
            Fill your equipment field. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
