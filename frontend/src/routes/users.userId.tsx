import { userQueryOptions } from "@/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  const { data } = useQuery(userQueryOptions(Number(searchUserId)));

  return (
    <div className="container max-w-screen-2xl flex-1 py-4">
      {data ? (
        <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-4 ">
          <div className="grid lg:row-span-4">
            <Card>
              <CardHeader>
                <CardTitle>{data.username}'s Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="items-center w-24 h-24">
                    <AvatarImage
                      src={data.image_url || undefined}
                      alt="Avatar"
                      className="rounded-full"
                    />
                    <AvatarFallback>{data.user_id}</AvatarFallback>
                  </Avatar>
                  <p className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {data.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.email_address}
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
                      {data.user_followers ? data.user_followers.length : 0}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Following
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {data.user_following ? data.user_following.length : 0}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Member since
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {new Date().getDate()}/{new Date().getMonth()}/
                      {new Date().getFullYear()}
                    </small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{data.username}'s Statistics</CardTitle>
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
                    <p className="text-sm font-medium leading-none">Defeats</p>
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
          <div className="grid lg:col-span-3 lg:col-start-2 lg:row-start-2">
            <Card>
              <CardHeader>
                <CardTitle>{data.username}'s Teams</CardTitle>
              </CardHeader>
              <CardContent className="grid">
                <ScrollArea>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <span className="sr-only">Team Avatar</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.teams
                        ? data.teams.map((team) => (
                            <TableRow key={team.team_id}>
                              <TableCell className="w-[100px]">
                                <Link to={`/teams/${team.team_id}`}>
                                  <Avatar className="items-center w-10 h-10">
                                    <AvatarImage
                                      src={team.team_image_url || undefined}
                                      alt="Avatar"
                                      className="rounded-full"
                                    />
                                    <AvatarFallback>
                                      {team.team_id}
                                    </AvatarFallback>
                                  </Avatar>
                                </Link>
                              </TableCell>
                              <TableCell className="font-medium">
                                <Link to={`/teams/${team.team_id}`}>
                                  {team.team_name}
                                </Link>
                              </TableCell>
                              <TableCell>{team.team_description}</TableCell>
                              <TableCell className="text-right">
                                {team.team_role}
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:col-span-3 lg:col-start-2 lg:row-start-3">
            <Card>
              <CardHeader>
                <CardTitle>{data.username}'s Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <span className="sr-only">Tournament Avatar</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Format</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Cash Prize</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.tournaments
                        ? data.tournaments.map((tournament) => (
                            <TableRow key={tournament.tournament_id}>
                              <TableCell className="w-[100px]">
                                <Link
                                  to={`/tournaments/${tournament.tournament_id}`}
                                >
                                  <Avatar className="items-center w-10 h-10">
                                    <AvatarImage
                                      src={
                                        tournament.tournament_image_url ||
                                        undefined
                                      }
                                      alt="Avatar"
                                      className="rounded-full"
                                    />
                                    <AvatarFallback>
                                      {tournament.tournament_id}
                                    </AvatarFallback>
                                  </Avatar>
                                </Link>
                              </TableCell>
                              <TableCell className="font-medium">
                                <Link
                                  to={`/tournaments/${tournament.tournament_id}`}
                                >
                                  {tournament.tournament_name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Link to={`/games/${tournament.game.game_id}`}>
                                  {tournament.game.game_name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                {tournament.tournament_format}
                              </TableCell>
                              <TableCell>
                                {tournament.tournament_visibility ===
                                "public" ? (
                                  <Users className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Users className="h-5 w-5 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell>
                                {tournament.tournament_user_role}
                              </TableCell>
                              <TableCell className="text-right">
                                ${tournament.tournament_cash_prize || 0}
                              </TableCell>
                            </TableRow>
                          ))
                        : null}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <div className="grid lg:col-span-3 lg:col-start-2 lg:row-start-4">
            <Card>
              <CardHeader>
                <CardTitle>{data.username}'s Past Tournaments</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
