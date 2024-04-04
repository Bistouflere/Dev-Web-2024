import { Tournament } from "@/types/type";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

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

export function tournamentPopularQueryOptions() {
  return queryOptions({
    queryKey: ["tournaments_popular"],
    queryFn: () => fetchTournamentPopular(),
    placeholderData: keepPreviousData,
  });
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
): Promise<Tournament[]> {
  return axios
    .get<Tournament[]>(`/api/tournaments?page=${page}&query=${query}`)
    .then((res) => {
      console.log("tournaments", res.data);
      return res.data;
    });
}

export async function fetchTournamentPopular(): Promise<Tournament[]> {
  return axios.get<Tournament[]>("/api/tournaments/popular").then((res) => {
    console.log("popular", res.data);
    return res.data;
  });
}
