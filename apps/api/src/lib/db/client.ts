import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

// eslint-disable-next-line node/no-process-env
export const db = drizzle({ connection: { connectionString: process.env.DATABASE_URL }, schema });
