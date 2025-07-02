import type { AppType } from "api/rpc";

import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:8787/");
