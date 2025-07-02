import type { Column } from "@tanstack/react-table";
import type { Equipment, EquipmentTypes } from "api/types";

import { useNavigate } from "@tanstack/react-router";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route } from "@/routes";

import { useEquipments } from "../../lib/queries";

type EquipmentType = keyof EquipmentTypes;

export function Filter({ column }: { column: Column<Equipment, unknown> }) {
  const { data } = useEquipments();
  const equipmentType = column.id as EquipmentType;
  const sp = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const handleChange = (val: string) => {
    navigate({
      search: prevSp => ({ ...prevSp, [column.id]: val === "all" ? "" : val }),
    });
  };

  const isEquipmentTypeColumn = equipmentType === "domain" || equipmentType === "type" || equipmentType === "category" || equipmentType === "subCategory";
  const shouldColumnBeFiltered = isEquipmentTypeColumn && column.getCanFilter();

  if (shouldColumnBeFiltered) {
    return (
      <div className="py-3">
        <Select onValueChange={handleChange} defaultValue={sp[equipmentType]}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Let's Select...`} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{column.id}</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectSeparator />
              {data?.equipmentTypes[equipmentType].map(type => (
                <SelectItem key={type.id.toString()} value={type.name!}>{type.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  }
}
