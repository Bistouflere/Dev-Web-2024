import { DataTableFacetedFilter } from "../../tables/data-table-faceted-filter";
import { open_state } from "./columns";
import { DataTableViewOptions } from "@/components/tables/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TeamTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter names..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("open") && (
          <DataTableFacetedFilter
            column={table.getColumn("open")}
            title="Open"
            options={open_state}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Link to="/dashboard/teams/create">
        <Button className="ml-auto mr-2 hidden h-8 sm:flex">
          Create Team
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </Link>
      <DataTableViewOptions table={table} />
    </div>
  );
}
