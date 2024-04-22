import { userTournamentsQueryOptions } from "@/api/users";
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
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserTournamentsTable({
  user,
  searchUserId,
  title,
  filters,
}: {
  user: User;
  searchUserId: string | undefined;
  title: string;
  filters: string[];
}) {
  const { data: tournaments } = useQuery(
    userTournamentsQueryOptions(searchUserId),
  );

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {user.username}'s {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Tournament Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Game</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Cash Prize</TableHead>
                <TableHead className="text-right">Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tournaments
                ? tournaments.map((tournament) =>
                    filters.includes(tournament.status) ? (
                      <TableRow key={tournament.id}>
                        <TableCell className="w-[100px]">
                          <Link to={`/tournaments/${tournament.id}`}>
                            <img
                              className="aspect-square rounded-md object-cover"
                              src={tournament.image_url || undefined}
                              alt={tournament.name}
                              loading="lazy"
                            />
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link to={`/tournaments/${tournament.id}`}>
                            {tournament.name}
                          </Link>
                        </TableCell>
                        <TableCell>{tournament.users_count}</TableCell>
                        <TableCell>
                          <Link to={`/games/${tournament.game_id}`}>
                            {tournament.game_name}
                          </Link>
                        </TableCell>
                        <TableCell>{tournament.format}</TableCell>
                        <TableCell>
                          {tournament.visibility === "public" ? (
                            <Users className="h-5 w-5 text-green-500" />
                          ) : (
                            <Users className="h-5 w-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>${tournament.cash_prize || 0}</TableCell>

                        <TableCell className="text-right">
                          {tournament.tournament_role}
                        </TableCell>
                      </TableRow>
                    ) : null,
                  )
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
