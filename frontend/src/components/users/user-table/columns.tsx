import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { UserTableRowActions } from "@/components/users/user-table/row-actions";
import { User } from "@/types/apiResponses";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { UsersIcon, WrenchIcon } from "lucide-react";

export const role = [
  {
    value: "admin",
    label: "Admin",
    icon: WrenchIcon,
  },
  {
    value: "user",
    label: "User",
    icon: UsersIcon,
  },
];

export const columns: ColumnDef<User>[] = [
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
            alt={row.getValue("username")}
            loading="lazy"
          />
        </div>
      );
    },
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span>{dayjs(row.getValue("created_at")).format("DD/MM/YYYY")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const roles = role.find((role) => role.value === row.getValue("role"));

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
    cell: ({ row }) => <UserTableRowActions row={row} />,
  },
];
