import { tournamentQueryOptions } from "@/api/tournaments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

export default function TournamentProfile() {
  const { tournamentId } = useParams();
  const { data } = useQuery(tournamentQueryOptions(tournamentId || ""));
  return (
    <div className="container relative">
      <Card>
        <CardHeader>
          <CardTitle>
            {" "}
            {data ? data.image_url : ""}
            {data ? data.name : <p>loading</p>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p>prize : {data ? `$${data.cash_prize || 0}` : "loading"}</p>
            <p>status : {data ? data.status : "loading"}</p>
            <p>format : {data ? data.format : "loading"}</p>
            <p>max team : {data ? data.max_team || "unlimited" : "loading"}</p>
            <p>max team size : {data ? data.max_team_size : "loading"}</p>
            <p>min team size : {data ? data.min_team_size : "loading"}</p>
            <p>
              start date :{" "}
              {data ? dayjs(data.start_date).format("DD/MM/YYYY") : "loading"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
