import { team_roles } from "./columns";
import { removeUserFromTeam } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { TeamUser } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Copy, Flag, Trash, User } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DashboardTeamMembersTableRowActions({
  row,
}: DataTableRowActionsProps<TeamUser>) {
  const { searchTeamId } = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const user = row.original;

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeUserFromTeam(
        user.id,
        searchTeamId || "",
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `You have successfully removed ${user.username} from the team.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error removing user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while removing ${user.username} from the team.`,
      });
    }
  };

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
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="hover:cursor-pointer">
            <Flag className="mr-2 w-5" />
            Role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={user.team_role}>
              {team_roles.map((role) => (
                <DropdownMenuRadioItem
                  className="hover:cursor-pointer"
                  key={role.label}
                  value={role.value}
                >
                  {role.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={loading}
          className="hover:cursor-pointer"
          onClick={() => handleRemove()}
        >
          <Trash className="mr-2 w-5" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
