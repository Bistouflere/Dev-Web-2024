import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWindowDimensions from "@/hooks/window-dimensions";
import { Team, Tournament } from "@/types/apiResponses";
import { Link } from "react-router-dom";

export default function TournamentsTeamCard({
  tournament,
  teams,
  // setTab,
}: {
  tournament: Tournament;
  teams: Team[];
  // setTab: (value: string) => void;
}) {
  const { width } = useWindowDimensions();
  const breakpoint = width < 640 ? "sm" : width < 1280 ? "lg" : "xl";

  const userDisplayCount = {
    sm: 3,
    lg: 5,
    xl: 9,
  };

  const visibleUsers = teams.slice(0, userDisplayCount[breakpoint]);
  const hiddenUsersCount = teams.length - visibleUsers.length;

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>{tournament.name}'s Teams</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {visibleUsers.map((tournament, index) => (
            <TeamCard
              key={tournament.id}
              team={tournament}
              className={`${index >= userDisplayCount[breakpoint] ? "hidden" : ""}`}
            />
          ))}
          {hiddenUsersCount > 0 && (
            <div
              onClick={() => {
                // setTab("tournaments");
              }}
              className="flex h-20 w-full cursor-pointer items-center gap-2 rounded-lg border bg-secondary p-4 hover:border-primary lg:w-60"
            >
              <span className="text-lg font-semibold">
                + {hiddenUsersCount} tournaments ...
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function TeamCard({ team, className }: { team: Team; className?: string }) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className={`flex h-20 w-full items-center gap-4 rounded-lg border bg-secondary p-4 hover:border-primary lg:w-60 ${className}`}
    >
      <img
        className="aspect-square h-10 w-10 rounded-md object-cover sm:h-12 sm:w-12"
        src={team.image_url || undefined}
        alt={team.name}
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{team.name}</span>
      </div>
    </Link>
  );
}
