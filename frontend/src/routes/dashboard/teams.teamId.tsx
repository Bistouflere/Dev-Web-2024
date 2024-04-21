import { teamQueryOptions, teamUsersQueryOptions } from "@/api/teams";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function TeamDetailPage() {
  const { userId } = useAuth();
  const { searchTeamId } = useParams();
  const navigate = useNavigate();

  const {
    data: team,
    isLoading: teamIsLoading,
    isFetching: teamIsFetching,
  } = useQuery(teamQueryOptions(searchTeamId || ""));

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: userIsFetching,
  } = useQuery(teamUsersQueryOptions(searchTeamId || ""));

  useEffect(() => {
    if (!teamIsLoading && !teamIsFetching && !team) {
      navigate("/dashboard/teams");
    }

    if (!usersLoading && !userIsFetching && !users) {
      navigate("/dashboard/teams");
    }

    if (team && users) {
      const isOwnerOrManager = users.some(
        (user) => user.id === userId && user.team_role !== "participant",
      );

      if (!isOwnerOrManager) navigate("/dashboard/teams");
    }
  }, [
    team,
    teamIsLoading,
    teamIsFetching,
    users,
    usersLoading,
    userIsFetching,
    userId,
    navigate,
  ]);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            Dashboard
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <Link to="/dashboard/teams">Your Teams</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">{searchTeamId}</div>
        </div>
        {team && users && (
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {team.name}
            </h1>
            <p className="pb-2 text-xl text-muted-foreground">
              {team.description}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
