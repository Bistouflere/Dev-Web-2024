import { APIResult } from "@/types/tournaments";
import { APIResult as APIResultPopular } from "@/types/tournaments.popular";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { id } from "date-fns/locale";

export function tournamentsCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`tournaments_count_${query}`, query],
    queryFn: () => fetchTournamentsCount(query),
    placeholderData: keepPreviousData,
  });
}

export function tournamentsQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`tournaments_page_${query}_${page}`, query, page],
    queryFn: () => fetchTournaments(query, page),
    placeholderData: keepPreviousData,
  });
}

export function tournamentQueryOptions(query : number) {
  return queryOptions({
    queryKey : [`tournaments_id_${query}`, query],
    queryFn : () => fetchTournamentsId(query),
    placeholderData : keepPreviousData,
  });
}
export function tournamentPopularQueryOptions() {
  return queryOptions({
    queryKey: ["tournaments_popular"],
    queryFn: () => fetchTournamentPopular(),
    placeholderData: keepPreviousData,
  });
}

export async function fetchTournamentsId(query:number) {
  return axios
  .get(`/api/tournaments/${query}`)
  .then((res) => {
    console.log("info", res.data);
    return res.data ;
  })
}
export async function fetchTournamentsCount(query: string): Promise<number> {
  return axios
    .get<Record<string, number>>(`/api/tournaments/count?query=${query}`)
    .then((res) => {
      console.log("count", res.data);
      return res.data.count;
    });
}

export async function fetchTournaments(
  query: string,
  page: number,
): Promise<APIResult> {
  return axios
    .get<APIResult>(`/api/tournaments?page=${page}&query=${query}`)
    .then((res) => {
      console.log("tournaments", res.data);
      return res.data;
    });
}

export async function fetchTournamentPopular(): Promise<APIResultPopular> {
  return axios.get<APIResultPopular>("/api/tournaments/popular").then((res) => {
    console.log("popular", res.data);
    return res.data;
  });
}
