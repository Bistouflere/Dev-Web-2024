import {
  teamQueryOptions,
  teamTournamentsQueryOptions,
  teamUsersQueryOptions,
} from "@/api/teams";
import { columns as membersColumns } from "@/components/dashboard/team-members-table/columns";
import { DashboardTeamMembersTable } from "@/components/dashboard/team-members-table/table";
import { DashboardTeamSettings } from "@/components/dashboard/team-settings";
import { columns as tournamentsColumns } from "@/components/dashboard/team-tournaments-table/columns";
import { DashboardTeamTournamentTable } from "@/components/dashboard/team-tournaments-table/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function TeamDetailPage() {
  const { searchTeamId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

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

  const { data: tournaments } = useQuery(
    teamTournamentsQueryOptions(searchTeamId || ""),
  );

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
            <Tabs defaultValue="settings" className="mt-4">
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              </TabsList>
              <TabsContent
                value="settings"
                className="mt-4 flex flex-col gap-4"
              >
                <DashboardTeamSettings />
              </TabsContent>
              <TabsContent value="members">
                <DashboardTeamMembersTable
                  columns={membersColumns}
                  data={users}
                />
              </TabsContent>
              <TabsContent value="tournaments">
                <DashboardTeamTournamentTable
                  columns={tournamentsColumns}
                  data={tournaments || []}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  );
}
