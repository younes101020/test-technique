import { Ellipsis } from "lucide-react";

import type { EquipmentUpsertDetailDialogStore } from "@/features/equipments/store/equipment";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initEquipmentDeleteDialog, initEquipmentUpsertDialog } from "@/features/equipments/store/equipment";

type EquipmentDropdownProps = Omit<EquipmentUpsertDetailDialogStore, "isDialogOpen">;

export function EquipmentEditDropdown(props: EquipmentDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-0" data-testid="equipment-options">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => initEquipmentUpsertDialog(props)} data-testid="equipment-edit">
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => initEquipmentDeleteDialog(props.id!)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
