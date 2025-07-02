import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { TreeSelect } from "@/features/equipments/components/equipment-tree-select";
import { equipmentTypesQueryOptions } from "@/features/equipments/lib/queries";

export function EquipmentTypesTreeSelect() {
  const [queryOptions] = useState(() => equipmentTypesQueryOptions());
  const { data } = useQuery(queryOptions);

  if (data)
    return <TreeSelect data={data} />;
}
