import { Button } from "../ui/button";
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
import { Check, Loader2, X } from "lucide-react";
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
          <TableHead className="text-right">
            <span className="sr-only">Accept/Reject</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Link to={`/teams/${response.team_id}`}>
                {response.team_name}
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link to={`/users/${response.user_id}`}>
                {response.user_username}
              </Link>
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  handleAccept(response);
                }}
                disabled={loading}
              >
                {loading ? <Loader2 /> : <Check />}
                <span className="sr-only">Accept</span>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleReject(response);
                }}
                disabled={loading}
              >
                {loading ? <Loader2 /> : <X />}
                <span className="sr-only">Reject</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
