import { Button } from "@/components/ui/button";
import { Team, TeamUser, Tournament } from "@/types/apiResponses";
import { DoorClosed, UserPlus } from "lucide-react";

export default function TeamHeader({
  userId,
  team,
  users,
  tournaments,
  handleTeamJoin,
  handleTeamLeave,
}: {
  userId: string | null | undefined;
  team: Team;
  users: TeamUser[];
  tournaments: Tournament[];
  handleTeamJoin: () => void;
  handleTeamLeave: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-4 pt-8 sm:flex-row">
        <img
          className="aspect-square h-32 w-32 rounded-md object-cover"
          src={team.image_url || undefined}
          alt={team.name}
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
          <p className="text-xl text-muted-foreground">
            {team.description || "No description"}
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Recruitment for this team are currently{" "}
            <span className="text-lg font-semibold uppercase">
              {team.open ? "open" : "closed"}
            </span>
          </p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-end">
        {users?.some((u) => u.id === userId) ? (
          <Button
            onClick={handleTeamLeave}
            disabled={!userId}
            variant="destructive"
          >
            <DoorClosed className="mr-2 h-5 w-5" />
            Leave the team
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
