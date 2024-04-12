import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/apiResponses";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Percent,
  Swords,
} from "lucide-react";
import React from "react";

export default function UserStatisticsCard({ user }: { user: User }) {
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  const games_played = getRandomInt(100);
  const defeats = getRandomInt(games_played);
  const draws = getRandomInt(games_played - defeats);
  const victories = games_played - defeats - draws;
  const winning_rate = Math.floor(
    ((victories + 0.5 * draws) / games_played) * 100,
  );

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>{user.username}'s Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 grid-rows-2 gap-6 lg:grid-cols-5 lg:grid-rows-1">
          <UserStatistic
            icon={<Swords className="h-10 w-10 text-purple-400" />}
            title="Games Played"
            result={games_played}
          />
          <UserStatistic
            icon={<ArrowUpRight className="h-10 w-10 text-green-400" />}
            title="Victories"
            result={victories}
          />
          <UserStatistic
            icon={<ArrowDownRight className="h-10 w-10 text-red-400" />}
            title="Defeats"
            result={defeats}
          />
          <UserStatistic
            icon={<ArrowRight className="h-10 w-10 text-yellow-400" />}
            title="Draws"
            result={draws}
          />
          <UserStatistic
            icon={<Percent className="h-10 w-10 text-blue-400" />}
            title="Winning Rate"
            result={`${winning_rate}%`}
          />
        </CardContent>
      </Card>
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
