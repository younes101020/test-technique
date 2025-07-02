import type { Column } from "@tanstack/react-table";

import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { useDebounceValue } from "@/hooks/use-debounce";
import { Route } from "@/routes";

export function Search({ column }: { column: Column<any, unknown> }) {
  const [debouncedSearchValue, setSearchValue] = useDebounceValue("", 500);
  const navigate = useNavigate({ from: Route.fullPath });

  useEffect(() => {
    navigate({
      search: prevSp => ({ ...prevSp, [column.id === "brand" ? "brand" : "model"]: debouncedSearchValue }),
    });
  }, [debouncedSearchValue]);

  const shouldColumnBeSearchable = (column.id === "model" || column.id === "brand") && column.getCanFilter();

  if (shouldColumnBeSearchable) {
    return (
      <div className="py-3">
        <Input
          type="text"
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search..."
        />
      </div>
    );
  }
}
