import { cancelInvitation } from "@/api/userActions";
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
import { Loader2, ShieldHalf, User, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DashboardSentInvitationsTableRowActions({
  row,
}: DataTableRowActionsProps<Invitation>) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const invitation = row.original;

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["user_sent_invitations"],
    });
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

  const handleCancel = async (invitation: Invitation) => {
    try {
      setLoading(true);
      await cancelInvitation(
        invitation.user_id,
        invitation.team_id,
        getToken,
        invalidateQueries,
      );
      toast({
        title: "Success!",
        description: `You have canceled the invitation sent to ${invitation.user_username}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      invalidateQueries();
      setLoading(false);
      console.error("Error canceling invitation:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while canceling the invitation. Please try again.`,
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
          onClick={() => (loading ? null : handleCancel(invitation))}
        >
          {loading ? (
            <Loader2 className="mr-2 w-5" />
          ) : (
            <X className="mr-2 w-5" />
          )}
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
