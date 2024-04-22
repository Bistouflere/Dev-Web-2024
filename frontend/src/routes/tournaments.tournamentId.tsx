import {
  tournamentQueryOptions,
  tournamentUsersQueryOptions,
} from "@/api/tournaments";
import TournamentMembersCard from "@/components/tournaments/members-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

export default function TournamentProfile() {
  const { searchTournamentId } = useParams();
  const { data } = useQuery(tournamentQueryOptions(searchTournamentId || ""));
  const { data: users } = useQuery(
    tournamentUsersQueryOptions(searchTournamentId || ""),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tab, setTab] = useState("overview");
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [`tournaments`],
    });
    queryClient.invalidateQueries({
      queryKey: [`tournament_users`],
    });
  }, [queryClient]);

  return (
    <>
      <div className="container relative">
        <div>
          <div className="flex gap-7">
            {data ? (
              <img
                className="aspect-square h-32 w-32 rounded-md object-cover"
                alt={data.name}
                src={data.image_url || undefined}
                loading="lazy"
              />
            ) : null}
            <div>
              <p>prize : {data ? `${data.cash_prize || 0}` : "loading"}</p>
              <p>status : {data ? data.status : "loading"}</p>
              <p>format : {data ? data.format : "loading"}</p>
              <p>
                max team : {data ? data.max_team || "unlimited" : "loading"}
              </p>
              <p>max team size : {data ? data.max_team_size : "loading"}</p>
              <p>min team size : {data ? data.min_team_size : "loading"}</p>
              <p>
                start date :{" "}
                {data ? dayjs(data.start_date).format("DD/MM/YYYY") : "loading"}
              </p>
            </div>
            <div className=" justify-end">
              {data ? (
                <Button
                  className="flex justify-center sm:justify-end"
                  onClick={async () => {
                    const token = await getToken();
                    await axios.post(
                      `/api/tournaments/${data.id}/users`,
                      {},
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      },
                    );
                    invalidateQueries();
                  }}
                >
                  {" "}
                  inscription tournoi{" "}
                </Button>
              ) : null}
              {data ? (
                <Button
                  onClick={async () => {
                    const token = await getToken();
                    await axios.delete(`/api/tournaments/${data.id}/users`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    invalidateQueries();
                  }}
                >
                  Désinscription du tournoi
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        {data ? (
          <TournamentMembersCard
            tournament={data}
            users={users || []}
            setTab={setTab}
          ></TournamentMembersCard>
        ) : null}
      </div>
    </>
  );
}
