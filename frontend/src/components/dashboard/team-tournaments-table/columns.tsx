import { DashboardTeamTournamentTableRowActions } from "@/components/dashboard/team-tournaments-table/row-actions";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Tournament } from "@/types/apiResponses";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const tournament_status = [
  {
    value: "upcoming",
    label: "Upcoming",
    icon: CircleIcon,
  },
  {
    value: "active",
    label: "Active",
    icon: StopwatchIcon,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CheckCircledIcon,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    icon: CrossCircledIcon,
  },
];

export const columns: ColumnDef<Tournament>[] = [
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
        <Link
          to={`/tournaments/${row.original.id}`}
          className="hidden sm:table-cell"
        >
          <img
            className="aspect-square w-16 rounded-md object-cover"
            src={row.getValue("image_url") || undefined}
            alt={row.getValue("name")}
            loading="lazy"
          />
        </Link>
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
        <Link to={`/tournaments/${row.original.id}`} className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </Link>
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
    accessorKey: "game_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Game" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span>{row.getValue("game_name")}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = tournament_status.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DashboardTeamTournamentTableRowActions row={row} />,
  },
];
