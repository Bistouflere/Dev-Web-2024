import { removeTeamFromTournament } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Tournament } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Pencil, ShieldHalf, Trash, Users } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DashboardTeamTournamentTableRowActions({
  row,
}: DataTableRowActionsProps<Tournament>) {
  const { searchTeamId } = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const tournament = row.original;

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await removeTeamFromTournament(
        searchTeamId || "",
        tournament.id,
        getToken,
        invalidateQueries,
      );

      toast({
        title: "Success!",
        description: `You have successfully left the tournament.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error leaving tournament:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while leaving the tournament.`,
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
        <Link to={`/tournaments/${tournament.id}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <ShieldHalf className="mr-2 w-5" />
            View Tournament
          </DropdownMenuItem>
        </Link>
        <Link
          to={`/dashboard/teams/${searchTeamId}/tournaments/${tournament.id}`}
        >
          <DropdownMenuItem className="hover:cursor-pointer">
            <Pencil className="mr-2 w-5" />
            Manage Tournament
          </DropdownMenuItem>
        </Link>
        <Link
          to={`/dashboard/teams/${searchTeamId}/tournaments/${tournament.id}/users`}
        >
          <DropdownMenuItem className="hover:cursor-pointer">
            <Users className="mr-2 w-5" />
            Manage Users
          </DropdownMenuItem>
        </Link>
        <Separator />
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
