import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamUser } from "@/types/apiResponses";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Copy, User } from "lucide-react";
import { Link } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function TeamMembersTableRowActions({
  row,
}: DataTableRowActionsProps<TeamUser>) {
  const user = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => navigator.clipboard.writeText(user.id)}
        >
          <Copy className="mr-2 w-5" />
          Copy ID
        </DropdownMenuItem>
        <Link to={`/users/${user.id}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <User className="mr-2 w-5" />
            View User
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
