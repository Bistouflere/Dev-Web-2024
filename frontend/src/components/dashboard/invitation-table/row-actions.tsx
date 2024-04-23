import { acceptInvitation, rejectInvitation } from "@/api/userActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { Invitation } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { Check, Loader2, ShieldHalf, User, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DashboardInvitationsTableRowActions({
  row,
}: DataTableRowActionsProps<Invitation>) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const invitation = row.original;

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["user_invitations"],
    });
    queryClient.invalidateQueries({
      queryKey: ["team_users"],
    });
    queryClient.invalidateQueries({
      queryKey: [`users`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user`],
    });
  }, [queryClient]);

  const handleAccept = async (invitation: Invitation) => {
    try {
      setLoading(true);
      await acceptInvitation(invitation.team_id, getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You are now part of ${invitation.team_name}.`,
      });

      setTimeout(() => {
        setLoading(false);
        navigate(`/teams/${invitation.team_id}`);
      }, 200);
    } catch (error) {
      invalidateQueries();
      setLoading(false);
      console.error("Error following user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while joining ${invitation.team_name}.`,
      });
    }
  };

  const handleReject = async (invitation: Invitation) => {
    try {
      setLoading(true);
      await rejectInvitation(invitation.team_id, getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You have rejected the invitation to join ${invitation.team_name}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      invalidateQueries();
      setLoading(false);
      console.error("Error unfollowing user:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while rejecting the invitation to join ${invitation.team_name}.`,
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
        <Link to={`/teams/${invitation.team_id}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <ShieldHalf className="mr-2 w-5" />
            View Team
          </DropdownMenuItem>
        </Link>
        <Link to={`/users/${invitation.user_id}`}>
          <DropdownMenuItem className="hover:cursor-pointer">
            <User className="mr-2 w-5" />
            View User
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => (loading ? null : handleAccept(invitation))}
        >
          {loading ? (
            <Loader2 className="mr-2 w-5" />
          ) : (
            <Check className="mr-2 w-5" />
          )}
          Accept
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => (loading ? null : handleReject(invitation))}
        >
          {loading ? (
            <Loader2 className="mr-2 w-5" />
          ) : (
            <X className="mr-2 w-5" />
          )}
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
