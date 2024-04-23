import {
  tournamentQueryOptions,
  tournamentTeamsQueryOptions,
  tournamentUsersQueryOptions,
} from "@/api/tournaments";
import { joinTournament, leaveTournament } from "@/api/userActions";
import TournamentHeader from "@/components/tournaments/header";
import TournamentMembersCard from "@/components/tournaments/members-card";
import TournamentsTeamCard from "@/components/tournaments/teams-card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";


export default function TournamentProfile() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { searchTournamentId } = useParams();
  const { data } = useQuery(tournamentQueryOptions(searchTournamentId || ""));
  const { data: users } = useQuery(
    tournamentUsersQueryOptions(searchTournamentId || ""),
  );
  const { data: team } = useQuery(
    tournamentTeamsQueryOptions(searchTournamentId || ""),
  );
  const queryClient = useQueryClient();
  const { userId, getToken } = useAuth();
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`tournaments`],
    });
    queryClient.invalidateQueries({
      queryKey: [`tournament_users`],
    });
  }, [queryClient]);
  

  const handleTournamentJoin = async () => {
    try {
      setLoading(true);
      await joinTournament(
        searchTournamentId || "",
        getToken,
        invalidateQueries,
      );
      toast({
        title: "Success!",
        description: `You have joined ${data?.name}.`,
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
          `An error occurred while joining ${data?.name}.`,
      });
    }
  };

  const handleTournamentLeave = async () => {
    try {
      setLoading(true);
      await leaveTournament(
        searchTournamentId || "",
        getToken,
        invalidateQueries,
      );
      toast({
        title: "Success!",
        description: `You have left ${data?.name}.`,
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
          `An error occurred while leaving ${data?.name}.`,
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="flex flex-col gap-4">
        <div className="flex gap-7">
          {data ? (
            <TournamentHeader
              userId={userId}
              tournament={data}
              teams={team || []}
              users={users || []}
              handleTournamentJoin={handleTournamentJoin}
              handleTournamentLeave={handleTournamentLeave}
              loading={loading}
            />
          ) : null}
        </div>
      </div>{" "}
      <hr />
      <div>
        {data ? (
          <TournamentMembersCard
            tournament={data}
            users={users || []}
            //setTab={setTab}
          ></TournamentMembersCard>
        ) : null}
      </div>
      <div>
        {data ? (
          <TournamentsTeamCard
            tournament={data}
            teams={team || []}
            // setTab={setTab}
          ></TournamentsTeamCard>
        ) : null}
      </div>
    </div>
  );
}
