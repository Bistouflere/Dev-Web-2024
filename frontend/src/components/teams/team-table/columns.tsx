import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { TeamTableRowActions } from "@/components/teams/team-table/row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Team } from "@/types/apiResponses";
import { ColumnDef } from "@tanstack/react-table";
import { Lock, LockOpen, UsersIcon } from "lucide-react";

export const open_state = [
  {
    value: true,
    label: "Yes",
    icon: LockOpen,
  },
  {
    value: false,
    label: "No",
    icon: Lock,
  },
];

export const columns: ColumnDef<Team>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image_url",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Avatar"
        className="hidden"
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="hidden sm:table-cell">
          <img
            className="aspect-square w-16 rounded-md object-cover"
            src={row.getValue("image_url") || undefined}
            alt={row.getValue("name")}
            loading="lazy"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate">
            {row.getValue("description")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "users_count",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Members" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("users_count")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open" />
    ),
    cell: ({ row }) => {
      const state = open_state.find(
        (state) => state.value === row.getValue("open"),
      );

      if (!state) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {state.icon && (
            <state.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{state.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TeamTableRowActions row={row} />,
  },
];
