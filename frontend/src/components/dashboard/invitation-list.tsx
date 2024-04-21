import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "../ui/use-toast";
import { acceptInvitation, rejectInvitation } from "@/api/userActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invitation } from "@/types/apiResponses";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, MoreHorizontal, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function DashboardInvitationList({
  response,
}: {
  response: Invitation[];
}) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team Name</TableHead>
          <TableHead>Inviter Name</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response) => (
          <TableRow key={response.team_id}>
            <TableCell className="font-medium">
              <Link to={`/teams/${response.team_id}`}>
                {response.team_name}
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/users/${response.inviter_id}`}>
                {response.inviter_username}
              </Link>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    className={
                      loading ? `cursor-not-allowed` : `cursor-pointer`
                    }
                    onClick={() => {
                      handleAccept(response);
                    }}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-5 w-5" />
                    )}
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={
                      loading ? `cursor-not-allowed` : `cursor-pointer`
                    }
                    onClick={() => {
                      handleReject(response);
                    }}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <X className="mr-2 h-5 w-5" />
                    )}
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
