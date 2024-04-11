import {
  Count,
  Match,
  Pool,
  Team,
  Tournament,
  UserTournament,
} from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function tournamentQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_${id}`, id],
    queryFn: () => fetchTournament(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentsQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`tournaments_${query}_${page}`, query, page],
    queryFn: () => fetchTournaments(query, page),
    placeholderData: keepPreviousData,
  });
}

export function tournamentsCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`tournaments_count_${query}`, query],
    queryFn: () => fetchTournamentsCount(query),
    placeholderData: keepPreviousData,
  });
}

export function tournamentTeamsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_teams_${id}`, id],
    queryFn: () => fetchTournamentTeams(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentTeamsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_teams_count_${id}`, id],
    queryFn: () => fetchTournamentTeamsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentUsersQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_users_${id}`, id],
    queryFn: () => fetchTournamentUsers(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentUsersCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_users_count_${id}`, id],
    queryFn: () => fetchTournamentUsersCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentPoolsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_pools_${id}`, id],
    queryFn: () => fetchTournamentPools(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentPoolCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_pool_count_${id}`, id],
    queryFn: () => fetchTournamentPoolsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentMatchesQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_matches_${id}`, id],
    queryFn: () => fetchTournamentMatches(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentMatchesCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_matches_count_${id}`, id],
    queryFn: () => fetchTournamentMatchesCount(id),
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

export async function fetchTournament(id: string): Promise<Tournament> {
  return axios.get<Tournament>(`/api/tournaments/${id}`).then((res) => {
    console.log(`/api/tournaments/${id}`, res.data);
    return res.data;
  });
}

export async function fetchTournaments(
  query: string,
  page: number,
): Promise<Tournament[]> {
  return axios
    .get<Tournament[]>(`/api/tournaments?page=${page}&query=${query}`)
    .then((res) => {
      console.log(`/api/tournaments?page=${page}&query=${query}`, res.data);
      return res.data;
    });
}

export async function fetchTournamentsCount(query: string): Promise<number> {
  return axios
    .get<Count>(`/api/tournaments/count?query=${query}`)
    .then((res) => {
      console.log(`/api/tournaments/count?query=${query}`, res.data);
      return res.data.count;
    });
}

export async function fetchTournamentTeams(id: string): Promise<Team[]> {
  return axios.get<Team[]>(`/api/tournaments/${id}/teams`).then((res) => {
    console.log(`/api/tournaments/${id}/teams`, res.data);
    return res.data;
  });
}

export async function fetchTournamentTeamsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/teams/count`).then((res) => {
    console.log(`/api/tournaments/${id}/teams/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentUsers(
  id: string,
): Promise<UserTournament[]> {
  return axios
    .get<UserTournament[]>(`/api/tournaments/${id}/users`)
    .then((res) => {
      console.log(`/api/tournaments/${id}/users`, res.data);
      return res.data;
    });
}

export async function fetchTournamentUsersCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/users/count`).then((res) => {
    console.log(`/api/tournaments/${id}/users/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentPools(id: string): Promise<Pool[]> {
  return axios.get<Pool[]>(`/api/tournaments/${id}/pools`).then((res) => {
    console.log(`/api/tournaments/${id}/pools`, res.data);
    return res.data;
  });
}

export async function fetchTournamentPoolsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/pools/count`).then((res) => {
    console.log(`/api/tournaments/${id}/pools/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentMatches(id: string): Promise<Match[]> {
  return axios.get<Match[]>(`/api/tournaments/${id}/matches`).then((res) => {
    console.log(`/api/tournaments/${id}/matches`, res.data);
    return res.data;
  });
}

export async function fetchTournamentMatchesCount(id: string): Promise<number> {
  return axios
    .get<Count>(`/api/tournaments/${id}/matches/count`)
    .then((res) => {
      console.log(`/api/tournaments/${id}/matches/count`, res.data);
      return res.data.count;
    });
}

export async function fetchTournamentPopular(): Promise<Tournament[]> {
  return axios.get<Tournament[]>("/api/tournaments/popular").then((res) => {
    console.log("/api/tournaments/popular", res.data);
    return res.data;
  });
}
