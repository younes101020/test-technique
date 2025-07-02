import type { Equipment } from "api/types";

import { createColumnHelper } from "@tanstack/react-table";

import { EquipmentEditDropdown } from "../equipment-edit-dropdown";

const columnHelper = createColumnHelper<Equipment>();

export const columns = [
  columnHelper.accessor("name", {
    cell: info => info.getValue(),
    header: () => <span>Name</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("brand", {
    cell: info => info.getValue(),
    header: () => <span>Brand</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("model", {
    cell: info => info.getValue(),
    header: () => <span>Model</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("domain", {
    cell: info => info.getValue(),
    header: () => <span>Domain</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("type", {
    cell: info => info.getValue(),
    header: () => <span>Type</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("category", {
    cell: info => info.getValue(),
    header: () => <span>Category</span>,
    footer: props => props.column.id,
  }),
  columnHelper.accessor("subCategory", {
    cell: info => info.getValue(),
    header: () => <span>Subcategory</span>,
    footer: props => props.column.id,
  }),
  columnHelper.display({
    id: "actions",
    cell: props => (
      <span className="flex justify-end">
        <EquipmentEditDropdown {...props.row.original} />
      </span>
    ),
  }),
];
