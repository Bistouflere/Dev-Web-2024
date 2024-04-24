import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWindowDimensions from "@/hooks/window-dimensions";
import { Team, Tournament } from "@/types/apiResponses";
import { Link } from "react-router-dom";

export default function TeamTournamentsCard({
  team,
  tournaments,
  setTab,
}: {
  team: Team;
  tournaments: Tournament[];
  setTab: (value: string) => void;
}) {
  const { width } = useWindowDimensions();
  const breakpoint = width < 640 ? "sm" : width < 1280 ? "lg" : "xl";

  const userDisplayCount = {
    sm: 3,
    lg: 5,
    xl: 9,
  };

  const visibleTournaments = tournaments.slice(0, userDisplayCount[breakpoint]);
  const hiddenUsersCount = tournaments.length - visibleTournaments.length;

  return (
    <div className="flex-auto">
      <Card>
        <CardHeader>
          <CardTitle>{team.name}'s Tournaments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {visibleTournaments.length === 0 && (
            <div className="flex h-20 w-full items-center gap-2 rounded-lg border bg-secondary p-4 lg:w-60">
              <span className="text-lg font-semibold">No tournaments yet</span>
            </div>
          )}
          {visibleTournaments.map((tournament, index) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              className={`${index >= userDisplayCount[breakpoint] ? "hidden" : ""}`}
            />
          ))}
          {hiddenUsersCount > 0 && (
            <div
              onClick={() => {
                setTab("tournaments");
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

function TournamentCard({
  tournament,
  className,
}: {
  tournament: Tournament;
  className?: string;
}) {
  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className={`flex h-20 w-full items-center gap-4 rounded-lg border bg-secondary p-4 hover:border-primary lg:w-60 ${className}`}
    >
      <img
        className="aspect-square h-10 w-10 rounded-md object-cover sm:h-12 sm:w-12"
        src={tournament.image_url || undefined}
        alt={tournament.name}
        loading="lazy"
      />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{tournament.name}</span>
      </div>
    </Link>
  );
}
