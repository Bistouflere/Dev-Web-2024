import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { TeamMembersTableRowActions } from "@/components/users/team-members-table/row-actions";
import { TeamUser } from "@/types/apiResponses";
import { ColumnDef } from "@tanstack/react-table";
import { CrownIcon, UsersIcon, WrenchIcon } from "lucide-react";

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

export const columns: ColumnDef<TeamUser>[] = [
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("username")}
          </span>
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
    cell: ({ row }) => <TeamMembersTableRowActions row={row} />,
  },
];
