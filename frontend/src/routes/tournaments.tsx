import UrlPagination from "@/components/pagination";
import { Search } from "@/components/search";
import { TableLoader } from "@/components/table-loader";
import { TournamentList } from "@/components/tournaments/list";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TournamentsAPIResponse } from "@/types/type";
import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export class TournamentNotFoundError extends Error {}

function countOptions(query: string) {
  return queryOptions({
    queryKey: ["tournaments_page_count", query],
    queryFn: () => fetchCount(query),
    placeholderData: keepPreviousData,
  });
}

function tournamentsOptions(query: string, page: number) {
  return queryOptions({
    queryKey: ["tournaments_page_tournaments", query, page],
    queryFn: () => fetchTournaments(query, page),
    placeholderData: keepPreviousData,
  });
}

async function fetchCount(query: string): Promise<number> {
  return axios
    .get<number>(`/api/tournaments/count?query=${query}`)
    .then((res) => res.data);
}

async function fetchTournaments(
  query: string,
  page: number,
): Promise<TournamentsAPIResponse[]> {
  return axios
    .get<
      TournamentsAPIResponse[]
    >(`/api/tournaments?page=${page}&query=${query}`)
    .then((res) => res.data);
}

const TOURNAMENT_PER_PAGE = 9;

export default function TournamentsPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  const countQuery = useQuery(countOptions(query));
  const tournamentsQuery = useQuery(tournamentsOptions(query, page));
  const pageCount = Math.ceil(countQuery.data! / TOURNAMENT_PER_PAGE);

  const startTournamentIndex = (page - 1) * TOURNAMENT_PER_PAGE + 1;
  const endTournamentIndex = Math.min(
    startTournamentIndex + TOURNAMENT_PER_PAGE - 1,
    countQuery.data || 0,
  );

  return (
    <div className="container relative">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
          Fight for glory in our tournaments
        </h1>
        <Balancer className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          Browse through our tournaments and find the perfect one for your team.
          You can search for tournaments by their name, game, or organizer.
        </Balancer>
      </section>
      <Search placeholder="Search tournaments..." />
      <Card>
        <CardContent>
          {countQuery.isLoading ||
          tournamentsQuery.isLoading ||
          countQuery.isFetching ||
          tournamentsQuery.isFetching ? (
            <TableLoader count={TOURNAMENT_PER_PAGE} />
          ) : (
            <TournamentList response={tournamentsQuery.data || []} />
          )}
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {startTournamentIndex}-{endTournamentIndex}
            </strong>{" "}
            of <strong>{countQuery.data || 0}</strong> tournaments
          </div>
        </CardFooter>
      </Card>
      {pageCount > 1 && <UrlPagination totalPages={pageCount} />}
    </div>
  );
}
