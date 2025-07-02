import type { QueryClient } from "@tanstack/react-query";

import "../App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { OnlineStateRadio } from "@/components/online-state-switch";
import { Card } from "@/components/ui/card";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="font-display">
      <Card className="container mx-auto py-5 px-2 bg-secondary mt-4">
        <OnlineStateRadio />
      </Card>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </div>
  );
}
