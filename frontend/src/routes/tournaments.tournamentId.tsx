import {
  tournamentQueryOptions,
  tournamentTeamsQueryOptions,
  tournamentUsersQueryOptions,
} from "@/api/tournaments";
import TournamentHeader from "@/components/tournaments/header";
import TournamentMembersCard from "@/components/tournaments/members-card";
import TournamentsTeamCard from "@/components/tournaments/teams-card";
import { columns as teamsColumns } from "@/components/tournaments/tournament-team-table/columns";
import { TournamentTeamTable } from "@/components/tournaments/tournament-team-table/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { columns as membersColumns } from "@/components/users/tournament-members-table/columns";
import { TournamentMembersTable } from "@/components/users/tournament-members-table/table";
import { useAuth } from "@clerk/clerk-react";
import { TabsContent } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function TournamentProfile() {
  const [tab, setTab] = useState("overview");
  const { searchTournamentId } = useParams();
  const { userId } = useAuth();

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const { data: tournament } = useQuery(
    tournamentQueryOptions(searchTournamentId || ""),
  );
  const { data: users } = useQuery(
    tournamentUsersQueryOptions(searchTournamentId || ""),
  );
  const { data: teams } = useQuery(
    tournamentTeamsQueryOptions(searchTournamentId || ""),
  );

  return (
    <div className="container py-4">
      {tournament && (
        <div className="flex flex-col gap-4">
          <TournamentHeader
            userId={userId}
            tournament={tournament}
            teams={teams || []}
            users={users || []}
          />
          <Tabs
            defaultValue="overview"
            value={tab}
            onValueChange={onTabChange}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="bracket">Bracket</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
              <TournamentMembersCard
                tournament={tournament}
                users={users || []}
                setTab={setTab}
              />
              <TournamentsTeamCard
                tournament={tournament}
                teams={teams || []}
                setTab={setTab}
              />
            </TabsContent>
            <TabsContent value="members">
              <TournamentMembersTable
                columns={membersColumns}
                data={users || []}
              />
            </TabsContent>
            <TabsContent value="teams">
              <TournamentTeamTable columns={teamsColumns} data={teams || []} />
            </TabsContent>
            <TabsContent value="bracket"></TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
