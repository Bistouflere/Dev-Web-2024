import {
  userFollowersQueryOptions,
  userFollowingQueryOptions,
  userQueryOptions,
  userTeamsQueryOptions,
  userTournamentsQueryOptions,
} from "@/api/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Percent,
  Plus,
  Swords,
  UserPlus,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function UserProfile() {
  const { searchUserId } = useParams();
  const { userId } = useAuth();

  const { data: user } = useQuery(userQueryOptions(searchUserId || ""));
  const { data: userFollowers } = useQuery(
    userFollowersQueryOptions(searchUserId || ""),
  );
  const { data: userFollowing } = useQuery(
    userFollowingQueryOptions(searchUserId || ""),
  );
  const { data: teams } = useQuery(userTeamsQueryOptions(searchUserId || ""));
  const { data: tournaments } = useQuery(
    userTournamentsQueryOptions(searchUserId || ""),
  );

  return (
    <div className="container py-4">
      {user ? (
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-none">
            <Card>
              <CardHeader>
                <CardTitle>{user.username}'s Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-2">
                  <img
                    className="aspect-square rounded-md object-cover w-24 h-24"
                    src={user.image_url || undefined}
                    alt={user.username}
                  />
                  <p className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {user.email_address}
                  </p>
                </div>
                <div className="mt-4 flex justify-center space-x-4">
                  <Button
                    onClick={() => console.log("follow", searchUserId)}
                    disabled={!userId}
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Follow
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => console.log("recruit", searchUserId)}
                    disabled={!userId}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Recruit
                  </Button>
                </div>
                <div className="mt-4">
                  <UserDetail
                    title="Followers"
                    result={userFollowers ? userFollowers.length : 0}
                  />
                  <UserDetail
                    title="Following"
                    result={userFollowing ? userFollowing.length : 0}
                  />
                  <UserDetail
                    title="Member Since"
                    result={dayjs(user.created_at).format("DD/MM/YYYY")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4 flex-auto flex-col">
            <div className="flex-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{user.username}'s Statistics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 grid-rows-2 gap-6 lg:grid-cols-5 lg:grid-rows-1">
                  <UserStatistic
                    icon={<Swords className="h-10 w-10 text-purple-400" />}
                    title="Games Played"
                    result="9"
                  />
                  <UserStatistic
                    icon={<ArrowUpRight className="h-10 w-10 text-green-400" />}
                    title="Victories"
                    result="7"
                  />
                  <UserStatistic
                    icon={<ArrowDownRight className="h-10 w-10 text-red-400" />}
                    title="Defeats"
                    result="2"
                  />
                  <UserStatistic
                    icon={<ArrowRight className="h-10 w-10 text-yellow-400" />}
                    title="Draws"
                    result="0"
                  />
                  <UserStatistic
                    icon={<Percent className="h-10 w-10 text-blue-400" />}
                    title="Winning Rate"
                    result="78%"
                  />
                </CardContent>
              </Card>
            </div>
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
                                <Link to={`/teams/${team.id}`}>
                                  {team.name}
                                </Link>
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
            <div className="flex-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{user.username}'s Tournaments</CardTitle>
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
                            tournament.status === "upcoming" ||
                            tournament.status === "active" ? (
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
                                <TableCell>
                                  ${tournament.cash_prize || 0}
                                </TableCell>

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
            <div className="flex-auto">
              <Card>
                <CardHeader>
                  <CardTitle>{user.username}'s Past Tournaments</CardTitle>
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
                            tournament.status === "completed" ||
                            tournament.status === "cancelled" ? (
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
                                <TableCell>
                                  ${tournament.cash_prize || 0}
                                </TableCell>

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
          </div>{" "}
        </div>
      ) : null}
    </div>
  );
}

function UserDetail({
  title,
  result,
}: {
  title: string;
  result: string | number;
}) {
  return (
    <div className="flex justify-between">
      <small className="text-sm font-medium leading-none">{title}</small>
      <small className="text-sm font-medium leading-none">{result}</small>
    </div>
  );
}

function UserStatistic({
  icon,
  title,
  result,
}: {
  icon: React.ReactNode;
  title: string;
  result: string | number;
}) {
  return (
    <div className="flex items-center space-x-2">
      {icon}
      <div>
        <p className="text-xl font-extrabold md:text-2xl">{result}</p>
        <p className="text-sm font-medium leading-none">{title}</p>
      </div>
    </div>
  );
}
