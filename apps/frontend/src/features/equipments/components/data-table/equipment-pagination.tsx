import { onlineManager } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useEquipments } from "@/features/equipments/lib/queries";
import { Route } from "@/routes";

export function EquipmentPagination() {
  const isOnline = onlineManager.isOnline();
  const { data } = useEquipments();
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const shouldBePaginated = !searchParams.brand && !searchParams.model;

  if (shouldBePaginated) {
    return (
      <div className="flex items-center justify-end space-x-2 py-4 text-xs">
        <Button
          className="text-xs"
          variant="outline"
          size="sm"
          disabled={data?.isStart || !searchParams.cursor || !isOnline}
          onClick={() => {
            navigate({
              search: prevSp => ({ ...prevSp, dir: "prev", cursor: data?.prevCursor }),
            });
          }}
        >
          {"<"}
        </Button>
        <Button
          className="text-xs"
          variant="outline"
          size="sm"
          onClick={() => {
            navigate({
              search: prevSp => ({ ...prevSp, cursor: data?.nextCursor, dir: "next" }),
            });
          }}
          disabled={data?.isEnd || !isOnline}
        >
          {">"}
        </Button>
      </div>
    );
  }
}
