import { userQueryOptions } from "@/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="grid md:row-span-3 lg:row-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{data.user.username}'s Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="items-center w-24 h-24">
                    <AvatarImage
                      src={data.user.image_url || undefined}
                      alt="Avatar"
                      className="rounded-full"
                    />
                    <AvatarFallback>{data.user.id}</AvatarFallback>
                  </Avatar>
                  <p className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
                    {data.user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {data.user.email_address}
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
                      {data.followers.length}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Following
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {data.following.length}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <small className="text-sm font-medium leading-none">
                      Member since
                    </small>
                    <small className="text-sm font-medium leading-none">
                      {new Date(data.user.created_at).getDate()}/
                      {new Date(data.user.created_at).getMonth()}/
                      {new Date(data.user.created_at).getFullYear()}
                    </small>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid md:col-start-2 md:row-start-1 lg:col-span-2 lg:col-start-2 lg:row-start-1">
            <Card>
              <CardHeader>
                <CardTitle>{data.user.username}'s Statistics</CardTitle>
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
          <div className="grid md:col-start-1 md:row-start-4 lg:col-start-1 lg:row-start-4">
            <Card>
              <CardHeader>
                <CardTitle>{data.user.username}'s Team</CardTitle>
              </CardHeader>
              <CardContent className="grid">
                {data.ownedTeam ? (
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <Link to={`/teams/${data.ownedTeam.id}`}>
                          <Avatar className="items-center w-24 h-24 mb-2">
                            <AvatarImage
                              src={data.ownedTeam.image_url || undefined}
                              alt="Avatar"
                              className="rounded-full"
                            />
                            <AvatarFallback>{data.ownedTeam.id}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <Link to={`/teams/${data.ownedTeam.id}`}>
                          <Button variant="secondary">
                            <Users className="mr-2 h-5 w-5" />
                            View Team
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                          {data.ownedTeam.name}
                        </h3>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                          {data.ownedTeam.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="items-center w-24 h-24 bg-muted rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                          No Team
                        </h3>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                          {data.user.username} is not part of any team.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid md:col-start-2 md:row-start-2 lg:col-span-2 lg:col-start-2 lg:row-start-2">
            <Card>
              <CardHeader>
                <CardTitle>{data.user.username}'s Tournament</CardTitle>
              </CardHeader>
              <CardContent>
                {data.tournament ? (
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <Link to={`/tournaments/${data.tournament.id}`}>
                          <Avatar className="items-center w-24 h-24 mb-2">
                            <AvatarImage
                              src={data.tournament.image_url || undefined}
                              alt="Avatar"
                              className="rounded-full"
                            />
                            <AvatarFallback>
                              {data.tournament.id}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <Link to={`/tournaments/${data.tournament.id}`}>
                          <Button variant="secondary">
                            <Users className="mr-2 h-5 w-5" />
                            View Tournament
                          </Button>
                        </Link>
                      </div>
                      <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                          {data.tournament.name}
                        </h3>
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                          {data.tournament.game_id}
                        </h4>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                          {data.tournament.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="items-center w-24 h-24 bg-muted rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                          No Tournament
                        </h3>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">
                          {data.user.username} has not participated in any
                          tournament.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid md:col-start-2 md:row-span-2 md:row-start-3 lg:col-span-2 lg:col-start-2 lg:row-span-2 lg:row-start-3">
            <Card>
              <CardHeader>
                <CardTitle>{data.user.username}'s Past Tournaments</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
