import { Separator } from "@/components/ui/separator";

import { EquipmentsTable } from "./components/data-table";
import { EquipmentPagination } from "./components/data-table/equipment-pagination";
import { EquipmentCreateDialog } from "./components/equipment-create-dialog";
import { EquipmentCreateForm } from "./components/equipment-create-form";
import { EquipmentDeleteDialog } from "./components/equipment-delete-dialog";
import { EquipmentEditDialog } from "./components/equipment-edit-dialog";

export function Equipments() {
  return (
    <div className="container mx-auto py-10">
      <Separator />
      <EquipmentCreateDialog>
        <EquipmentCreateForm />
      </EquipmentCreateDialog>
      <Separator />
      <div>
        <EquipmentsTable />
        <EquipmentPagination />
      </div>
      <EquipmentEditDialog />
      <EquipmentDeleteDialog />
    </div>
  );
}
