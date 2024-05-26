import { DashboardTeamTableRowActions } from "@/components/dashboard/team-table/row-actions";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { UserTeam } from "@/types/apiResponses";
import { ColumnDef } from "@tanstack/react-table";
import { CrownIcon, UsersIcon, WrenchIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const team_roles = [
  {
    value: "owner",
    label: "Owner",
    icon: CrownIcon,
  },
  {
    value: "manager",
    label: "Manager",
    icon: WrenchIcon,
  },
  {
    value: "participant",
    label: "Participant",
    icon: UsersIcon,
  },
];

export const columns: ColumnDef<UserTeam>[] = [
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
        <Link to={`/teams/${row.original.id}`} className="hidden sm:table-cell">
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
        <Link to={`/teams/${row.original.id}`} className="flex space-x-2">
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
    accessorKey: "team_role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roles = team_roles.find(
        (role) => role.value === row.getValue("team_role"),
      );

      if (!roles) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {roles.icon && (
            <roles.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{roles.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DashboardTeamTableRowActions row={row} />,
  },
];
