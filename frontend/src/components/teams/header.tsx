import { Button } from "@/components/ui/button";
import { Team, TeamUser, Tournament } from "@/types/apiResponses";
import { DoorClosed, Loader2, Pencil, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export default function TeamHeader({
  userId,
  team,
  users,
  tournaments,
  handleTeamJoin,
  handleTeamLeave,
  loading,
}: {
  userId: string | null | undefined;
  team: Team;
  users: TeamUser[];
  tournaments: Tournament[];
  handleTeamJoin: () => void;
  handleTeamLeave: () => void;
  loading: boolean;
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-4 pt-8 sm:flex-row">
        <img
          className="aspect-square h-32 w-32 rounded-md object-cover"
          src={team.image_url || undefined}
          alt={team.name}
          loading="lazy"
        />
        <div className="flex flex-col space-y-2">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {team.name}
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
                {tournaments?.length || 0}
              </span>
              <span className="text-lg text-muted-foreground">
                {" "}
                tournaments
              </span>
            </div>
          </div>
          <Balancer className="text-xl text-muted-foreground">
            {team.description || "No description"}
          </Balancer>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Recruitment for this team are currently{" "}
            <span className="text-lg font-semibold">
              {team.open ? "open" : "closed"}
            </span>
            .
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        {users.some((u) => {
          return u.id === userId && u.team_role !== "participant";
        }) && (
          <Link to={`/dashboard/teams/${team.id}`}>
            <Button className="mr-2" variant="secondary">
              <Pencil className="mr-2 h-5 w-5" /> Edit team
            </Button>
          </Link>
        )}
        {users?.some((u) => u.id === userId) ? (
          loading ? (
            <Button disabled variant="destructive">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Leave the team
            </Button>
          ) : (
            <Button
              onClick={handleTeamLeave}
              disabled={
                !userId ||
                users.some((u) => {
                  return u.id === userId && u.team_role === "owner";
                })
              }
              variant="destructive"
            >
              <DoorClosed className="mr-2 h-5 w-5" />
              Leave the team
            </Button>
          )
        ) : loading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Join the team
          </Button>
        ) : (
          <Button
            onClick={handleTeamJoin}
            disabled={
              !team.open || !userId || users?.some((u) => u.id === userId)
            }
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Join the team
          </Button>
        )}
      </div>
      <hr />
    </>
  );
}
