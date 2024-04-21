import { userTeamsQueryOptions } from "@/api/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/types/apiResponses";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function UserTeamsTable({
  user,
  searchUserId,
}: {
  user: User;
  searchUserId: string | undefined;
}) {
  const { data: teams } = useQuery(userTeamsQueryOptions(searchUserId));

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>{user.username}'s Teams</CardTitle>
        </CardHeader>
        <CardContent className="grid">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Team Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams
                ? teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="w-[100px]">
                        <Link to={`/teams/${team.id}`}>
                          <img
                            className="aspect-square rounded-md object-cover"
                            src={team.image_url || undefined}
                            alt={team.name}
                          />
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link to={`/teams/${team.id}`}>{team.name}</Link>
                      </TableCell>
                      <TableCell>{team.description}</TableCell>
                      <TableCell>{team.users_count}</TableCell>
                      <TableCell className="text-right">
                        {team.team_role}
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
