import { and, eq, gt, like, lt, or } from "drizzle-orm";

import type { EquipmentSearchParam, EquipmentTypeNode } from "./types";

import { equipments, equipmentTypes } from "./db/schema";

export function reverseTree(node: EquipmentTypeNode | null) {
  const stack: EquipmentTypeNode[] = [];

  while (node) {
    stack.push({
      ...node,
      id: node.id,
      name: node.name,
      level: node.level,
      children: [],
    });
    node = node.parent ?? null;
  }
  const root = stack.pop()!;
  let current = root;

  while (stack.length > 0) {
    const child = stack.pop()!;
    current.children?.push(child);
    current = child;
  }

  return root;
}

export function getPaginationQuery({ cursor, dir }: { cursor?: number; dir: string }) {
  return cursor ? dir === "prev" ? lt(equipments.id, cursor) : gt(equipments.id, cursor) : undefined;
}

export function getSearchQuery({ brand, model }: Record<string, string | undefined>) {
  return or(
    brand ? like(equipments.brand, `%${brand}%`) : undefined,
    model ? like(equipments.model, `%${model}%`) : undefined,
  );
}
