import { removeUserFromTournament } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { TournamentUser } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Copy, User, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DashboardTeamTournamentUsersTableRowActions({
  row,
}: DataTableRowActionsProps<TournamentUser>) {
  const { searchTeamId, searchTournamentId } = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const user = row.original;

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const handleUnregister = async () => {
    try {
      setLoading(true);
      await removeUserFromTournament(
        user.id,
        searchTournamentId || "",
        searchTeamId || "",
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `You have successfully removed ${user.username} from the tournament.`,
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
          `An error occurred while removing ${user.username} from the tournament.`,
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
        <Separator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          disabled={loading}
          onClick={() => handleUnregister()}
        >
          <X className="mr-2 w-5" />
          Remove User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
