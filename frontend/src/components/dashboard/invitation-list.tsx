import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invitation } from "@/types/apiResponses";
import { Check, MoreHorizontal, X } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardInvitationList({
  response,
}: {
  response: Invitation[];
}) {
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
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(`Accepted Invitation ${response.team_id}`);
                    }}
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      console.log(`Rejected Invitation ${response.team_id}`);
                    }}
                  >
                    <X className="mr-2 h-5 w-5" />
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
