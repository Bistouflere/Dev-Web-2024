import { useParams } from "react-router-dom";
import { tournamentQueryOptions } from "@/api/tournaments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs"

export default function TournamentProfile() {
  const { tournamentId } = useParams();
  const {data} = useQuery(tournamentQueryOptions(Number(tournamentId)))
  return (
    <div className="container relative">
      <Card>
        <CardHeader>
          <CardTitle> {data? (data.tournament_image_url) : ("")}{data? (data.tournament_name) : (<p>loading</p>)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p>prize : {data? (data.cash_prize) : ("loading")}</p>
            <p>status : {data? (data.tournament_status) : ("loading")}</p>
            <p>format : {data? (data.tournament_format) : ("loading")}</p>
            <p>max team : {data? (data.max_teams) : ("loading")}</p>
            <p>max team size : {data? (data.max_team_size) : ("loading")}</p>
            <p>min team size : {data? (data.min_team_size) : ("loading")}</p>
            <p>start date : {data? (dayjs(data.tournament_start_date).format('YYYY-MM-DD')) : ("loading")}</p>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
