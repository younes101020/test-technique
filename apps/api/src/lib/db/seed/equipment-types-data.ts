const RANDOM_DATE = new Date(Math.random() * (Date.now() - new Date("2020-01-01").getTime()) + new Date("2020-01-01").getTime());

export const equipmentTypesData = [
  {
    id: 1,
    name: "Medical Equipment",
    parentId: null,
    level: "domain" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },
  {
    id: 2,
    name: "Office Equipment",
    parentId: null,
    level: "domain" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },

  {
    id: 3,
    name: "Diagnostic Equipment",
    parentId: 1,
    level: "type" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },
  {
    id: 4,
    name: "Desktop",
    parentId: 2,
    level: "type" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },

  {
    id: 5,
    name: "Scanner",
    parentId: 3,
    level: "category" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },
  {
    id: 6,
    name: "Software",
    parentId: 4,
    level: "category" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },

  {
    id: 7,
    name: "Particle Filter",
    parentId: 5,
    level: "subcategory" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },
  {
    id: 8,
    name: "Windows OS",
    parentId: 6,
    level: "subcategory" as const,
    createdAt: RANDOM_DATE,
    updatedAt: RANDOM_DATE,
  },
];
