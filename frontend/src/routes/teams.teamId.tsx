import {
  teamQueryOptions,
  teamTournamentsQueryOptions,
  teamUsersQueryOptions,
} from "@/api/teams";
import { joinTeam, leaveTeam } from "@/api/userActions";
import TeamHeader from "@/components/teams/header";
import TeamMembersCard from "@/components/teams/members-card";
import TeamStatisticsCard from "@/components/teams/statistics-card";
import { columns as tournamentsColumns } from "@/components/teams/team-tournament-table/columns";
import { TeamTournamentTable } from "@/components/teams/team-tournament-table/table";
import TeamTournamentsCard from "@/components/teams/tournaments-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { columns as membersColumns } from "@/components/users/team-members-table/columns";
import { TeamMembersTable } from "@/components/users/team-members-table/table";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

export default function TeamProfile() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const { searchTeamId } = useParams();
  const { userId, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const { data: team } = useQuery(teamQueryOptions(searchTeamId || ""));
  const { data: users } = useQuery(teamUsersQueryOptions(searchTeamId || ""));
  const { data: tournaments } = useQuery(
    teamTournamentsQueryOptions(searchTeamId || ""),
  );

  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`users`],
    });
    queryClient.invalidateQueries({
      queryKey: [`user`],
    });
    queryClient.invalidateQueries({ queryKey: [`user_teams`] });
    queryClient.invalidateQueries({ queryKey: [`team`] });
    queryClient.invalidateQueries({ queryKey: [`teams`] });
    queryClient.invalidateQueries({
      queryKey: [`team_users`],
    });
  }, [queryClient]);

  const handleTeamJoin = async () => {
    try {
      setLoading(true);
      await joinTeam(searchTeamId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You have joined ${team?.name}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error joining team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while joining ${team?.name}.`,
      });
    }
  };

  const handleTeamLeave = async () => {
    try {
      setLoading(true);
      await leaveTeam(searchTeamId || "", getToken, invalidateQueries);
      toast({
        title: "Success!",
        description: `You have left ${team?.name}.`,
      });

      setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch (error) {
      setLoading(false);
      console.error("Error leaving team:", error);
      toast({
        variant: "destructive",
        title: "Oops!",
        description:
          (error as Error).message ||
          `An error occurred while leaving ${team?.name}.`,
      });
    }
  };

  return (
    <div className="container py-4">
      {team && (
        <div className="flex flex-col gap-4">
          <TeamHeader
            userId={userId}
            team={team}
            users={users || []}
            tournaments={tournaments || []}
            handleTeamJoin={handleTeamJoin}
            handleTeamLeave={handleTeamLeave}
            loading={loading}
          />
          <Tabs
            defaultValue="overview"
            value={tab}
            onValueChange={onTabChange}
            className="mt-4"
          >
            <TabsList className="flex max-w-[392px] justify-start overflow-scroll sm:overflow-hidden">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              <TabsTrigger value="match_played">Match Played</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
              <TeamStatisticsCard team={team} />
              <TeamMembersCard
                team={team}
                users={users || []}
                setTab={setTab}
              />
              <TeamTournamentsCard
                team={team}
                tournaments={tournaments || []}
                setTab={setTab}
              />
            </TabsContent>
            <TabsContent value="members">
              <TeamMembersTable columns={membersColumns} data={users || []} />
            </TabsContent>
            <TabsContent value="tournaments">
              <TeamTournamentTable
                columns={tournamentsColumns}
                data={tournaments || []}
              />
            </TabsContent>
            <TabsContent value="match_played"></TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
