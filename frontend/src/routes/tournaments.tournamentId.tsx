import { tournamentQueryOptions } from "@/api/tournaments";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

export default function TournamentProfile() {
  const { searchTournamentId } = useParams();
  const { data } = useQuery(tournamentQueryOptions(searchTournamentId || ""));
  const { getToken } = useAuth();

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
    </>
  );
}
