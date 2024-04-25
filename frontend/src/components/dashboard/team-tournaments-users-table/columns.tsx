import { DashboardTeamTournamentUsersTableRowActions } from "@/components/dashboard/team-tournaments-users-table/row-actions";
import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import { TournamentUser } from "@/types/apiResponses";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TournamentUser>[] = [
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
    id: "actions",
    cell: ({ row }) => (
      <DashboardTeamTournamentUsersTableRowActions row={row} />
    ),
  },
];
