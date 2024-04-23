import { Button } from "@/components/ui/button";
import { Team, Tournament, TournamentUser } from "@/types/apiResponses";
import { DoorClosed, Loader2, UserPlus } from "lucide-react";

export default function TournamentHeader({
  userId,
  tournament,
  users,
  teams,
  handleTournamentJoin,
  handleTournamentLeave,
  loading,
}: {
  userId: string | null | undefined;
  teams: Team[];
  users: TournamentUser[];
  tournament: Tournament;
  handleTournamentJoin: () => void;
  handleTournamentLeave: () => void;
  loading: boolean;
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
              <span className="text-lg text-muted-foreground">
                {" "}
                participant
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold">
                {teams?.length || 0}
              </span>
              <span className="text-lg text-muted-foreground"> teams</span>
            </div>
          </div>
          <p className="text-xl text-muted-foreground">
            {tournament.description || "No description"}
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Recruitment for this tournament are currently{" "}
            <span className="text-lg font-semibold uppercase">
              {tournament.status ? "upcoming" : "active"}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        {users?.some((u) => u.id === userId) ? (
          loading ? (
            <Button disabled variant="destructive">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Leave the tournament
            </Button>
          ) : (
            <Button
              onClick={handleTournamentLeave}
              disabled={!userId}
              variant="destructive"
            >
              <DoorClosed className="mr-2 h-5 w-5" />
              Leave the tournament
            </Button>
          )
        ) : loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Join the tournament
          </Button>
        ) : (
          <Button
            onClick={handleTournamentJoin}
            disabled={
              !tournament.visibility ||
              !userId ||
              users?.some((u) => u.id === userId)
            }
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Join the tournament
          </Button>
        )}
      </div>
      <hr />
    </>
  );
}
