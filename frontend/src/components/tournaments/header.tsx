import { TournamentTeamRegister } from "./register-team";
import { Button } from "@/components/ui/button";
import { Team, Tournament, TournamentUser } from "@/types/apiResponses";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export default function TournamentHeader({
  userId,
  tournament,
  users,
  teams,
}: {
  userId: string | null | undefined;
  tournament: Tournament;
  users: TournamentUser[];
  teams: Team[];
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-4 pt-8 sm:flex-row">
        <img
          className="aspect-square h-32 w-32 rounded-md object-cover"
          src={tournament.image_url || undefined}
          alt={tournament.name}
          loading="lazy"
        />
        <div className="flex flex-col space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {tournament.name}
          </h1>
          <div className="flex gap-4">
            <div>
              <span className="text-lg font-semibold">
                {users?.length || 0}
              </span>
              <span className="text-lg text-muted-foreground"> members</span>
            </div>
            <div>
              <span className="text-lg font-semibold">
                {teams?.length || 0}
                {tournament?.max_teams && " / " + tournament.max_teams}
              </span>
              <span className="ml-1 text-lg text-muted-foreground"> teams</span>
            </div>
            <div>
              <span className="text-lg font-semibold">
                {tournament.game_name}
              </span>
              <span className="text-lg text-muted-foreground">
                {" "}
                ({tournament.format})
              </span>
            </div>
          </div>
          <Balancer className="text-xl text-muted-foreground">
            {tournament.description || "No description"}
          </Balancer>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            This tournament is currently{" "}
            <span className="text-lg font-semibold">
              {tournament.visibility ? "open" : "closed"}
            </span>{" "}
            and is{" "}
            <span className="text-lg font-semibold">{tournament.status}</span>.
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        {users.some((u) => {
          return (
            u.id === userId &&
            (u.tournament_role === "owner" || u.tournament_role === "manager")
          );
        }) && (
          <Link to={`/dashboard/tournaments/${tournament.id}`}>
            <Button className="mr-2">
              <Pencil className="mr-2 h-5 w-5" /> Edit tournament
            </Button>
          </Link>
        )}
        <TournamentTeamRegister />
      </div>
      <hr />
    </>
  );
}
