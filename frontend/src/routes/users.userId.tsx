import {
  userFollowersQueryOptions,
  userFollowingQueryOptions,
  userQueryOptions,
  userTeamsQueryOptions,
  userTournamentsQueryOptions,
} from "@/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                  <Avatar className="items-center w-24 h-24">
                    <AvatarImage
                      src={user.image_url || undefined}
                      alt="Avatar"
                      className="rounded-full"
                    />
                    <AvatarFallback>{user.id}</AvatarFallback>
                  </Avatar>
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
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Followers
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {userFollowers ? userFollowers.length : 0}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Following
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {userFollowing ? userFollowing.length : 0}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Member since
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {new Date(user.created_at).getDate()}/
                      {new Date(user.created_at).getMonth()}/
                      {new Date(user.created_at).getFullYear()}
                    </small>
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <Swords className="h-10 w-10 text-purple-400" />
                    <div>
                      <p className="text-xl font-extrabold md:text-2xl">9</p>
                      <p className="text-sm font-medium leading-none">
                        Game Played
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-10 w-10 text-green-400" />
                    <div>
                      <p className="text-xl font-extrabold md:text-2xl">7</p>
                      <p className="text-sm font-medium leading-none">
                        Victories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowDownRight className="h-10 w-10 text-red-400" />
                    <div>
                      <p className="text-xl font-extrabold md:text-2xl">2</p>
                      <p className="text-sm font-medium leading-none">
                        Defeats
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-10 w-10 text-yellow-400" />
                    <div>
                      <p className="text-xl font-extrabold md:text-2xl">0</p>
                      <p className="text-sm font-medium leading-none">Draws</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Percent className="h-10 w-10 text-blue-400" />
                    <div>
                      <p className="text-xl font-extrabold md:text-2xl">78%</p>
                      <p className="text-sm font-medium leading-none">
                        Winning Rate
                      </p>
                    </div>
                  </div>
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
                                  <Avatar className="items-center w-10 h-10">
                                    <AvatarImage
                                      src={team.image_url || undefined}
                                      alt="Avatar"
                                      className="rounded-full"
                                    />
                                    <AvatarFallback>{team.id}</AvatarFallback>
                                  </Avatar>
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
                        ? tournaments.map((tournament) => (
                            <TableRow key={tournament.id}>
                              <TableCell className="w-[100px]">
                                <Link to={`/tournaments/${tournament.id}`}>
                                  <Avatar className="items-center w-10 h-10">
                                    <AvatarImage
                                      src={tournament.image_url || undefined}
                                      alt="Avatar"
                                      className="rounded-full"
                                    />
                                    <AvatarFallback>
                                      {tournament.id}
                                    </AvatarFallback>
                                  </Avatar>
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
                  <CardTitle>{user.username}'s Past Tournaments</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </div>{" "}
        </div>
      ) : null}
    </div>
  );
}
