import {
  tournamentQueryOptions, // tournamentTeamsQueryOptions,
  tournamentUsersQueryOptions,
} from "@/api/tournaments";
// import { columns as membersColumns } from "@/components/dashboard/team-members-table/columns";
// import { DashboardTeamMembersTable } from "@/components/dashboard/team-members-table/table";
import { DashboardTournamentSettings } from "@/components/dashboard/tournament-settings";
// import { columns as tournamentsColumns } from "@/components/dashboard/team-tournaments-table/columns";
// import { DashboardTeamTournamentTable } from "@/components/dashboard/team-tournaments-table/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon } from "lucide-react";
import { Suspense, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function TournamentDetailPage() {
  const { searchTournamentId } = useParams();
  const navigate = useNavigate();
  const { userId } = useAuth();

  const {
    data: tournament,
    isLoading: tournamentIsLoading,
    isFetching: tournamentIsFetching,
  } = useQuery(tournamentQueryOptions(searchTournamentId || ""));

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: userIsFetching,
  } = useQuery(tournamentUsersQueryOptions(searchTournamentId || ""));

  // const { data: teams } = useQuery(
  //   tournamentTeamsQueryOptions(searchTournamentId || ""),
  // );

  useEffect(() => {
    if (!tournamentIsLoading && !tournamentIsFetching && !tournament) {
      navigate("/dashboard/tournaments");
    }

    if (!usersLoading && !userIsFetching && !users) {
      navigate("/dashboard/tournaments");
    }

    if (tournament && users) {
      const isOwnerOrManager = users.some(
        (user) => user.id === userId && user.tournament_role !== "participant",
      );

      if (!isOwnerOrManager) navigate("/dashboard/tournaments");
    }
  }, [
    tournament,
    tournamentIsLoading,
    tournamentIsFetching,
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
            <Link to="/dashboard/tournaments">Your Tournaments</Link>
          </div>
          <ChevronRightIcon className="h-4 w-4" />
          <div className="font-medium text-foreground">
            {searchTournamentId}
          </div>
        </div>
        {tournament && users && (
          <div className="space-y-2">
            <Tabs defaultValue="settings" className="mt-4">
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="tournaments">Teams</TabsTrigger>
              </TabsList>
              <TabsContent
                value="settings"
                className="mt-4 flex flex-col gap-4"
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <DashboardTournamentSettings />
                </Suspense>
              </TabsContent>
              <TabsContent value="members">
                {/* <DashboardTeamMembersTable
                  columns={membersColumns}
                  data={users}
                /> */}
              </TabsContent>
              <TabsContent value="tournaments">
                {/* <DashboardTeamTournamentTable
                  columns={tournamentsColumns}
                  data={teams || []}
                /> */}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </main>
  );
}
