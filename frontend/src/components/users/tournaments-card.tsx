import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserTournament } from "@/types/apiResponses";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserTournamentsTable({
  user,
  tournaments,
  title,
  filters,
}: {
  user: User;
  tournaments: UserTournament[];
  title: string;
  filters: string[];
}) {
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
