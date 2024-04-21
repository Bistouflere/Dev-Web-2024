import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { cancelInvitation } from "@/api/userActions";
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
import { Loader2, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";

export function DashboardSentInvitationList({
  response,
}: {
  response: Invitation[];
}) {
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["user_invitations"],
    });
    queryClient.invalidateQueries({
      queryKey: ["user_sent_invitations"],
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
      console.error("Error unfollowing user:", error);
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team Name</TableHead>
          <TableHead>Invited Name</TableHead>
          <TableHead>
            <span className="sr-only text-right">Cancel</span>
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
            <TableCell className="text-right">
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={() => handleCancel(response)}
                  disabled={loading}
                >
                  {loading ? <Loader2 /> : <X />}
                  <span className="sr-only">Cancel</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
