import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTeam } from "@/types/apiResponses";
import { Link } from "react-router-dom";

export function DashboardTeamList({ response }: { response: UserTeam[] }) {
  response.sort((a, b) => {
    if (a.team_role === "owner") {
      return -1;
    }
    if (b.team_role === "owner") {
      return 1;
    }
    if (a.team_role === "manager") {
      return -1;
    }
    if (b.team_role === "manager") {
      return 1;
    }
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Team Avatar</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="hidden lg:table-cell">Description</TableHead>
          <TableHead className="hidden sm:table-cell">Members</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">
            <span className="sr-only">Edit/View</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {response.map((response) => (
          <TableRow key={response.id}>
            <TableCell className="hidden sm:table-cell">
              <Link
                to={
                  response.team_role === "participant"
                    ? `/teams/${response.id}`
                    : `/dashboard/teams/${response.id}`
                }
              >
                <img
                  className="aspect-square rounded-md object-cover"
                  src={response.image_url || undefined}
                  alt={response.name}
                  loading="lazy"
                />
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link
                to={
                  response.team_role === "participant"
                    ? `/teams/${response.id}`
                    : `/dashboard/teams/${response.id}`
                }
              >
                {response.name}
              </Link>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
              {response.description}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {response.users_count}
            </TableCell>
            <TableCell>{response.team_role}</TableCell>
            <TableCell className="text-right">
              {response.team_role === "participant" ? (
                <Link to={`/teams/${response.id}`}>View</Link>
              ) : (
                <Link to={`/dashboard/teams/${response.id}`}>Edit</Link>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
