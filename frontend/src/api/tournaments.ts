import { LOG_ENABLED } from "@/config";
import { Count, Team, Tournament, TournamentUser } from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function tournamentQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournaments`, { id }],
    queryFn: () => fetchTournament(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentsQueryOptions() {
  return queryOptions({
    queryKey: [`tournaments`],
    queryFn: () => fetchTournaments(),
    placeholderData: keepPreviousData,
  });
}

export function tournamentsCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`tournaments_count`, { query }],
    queryFn: () => fetchTournamentsCount(query),
    placeholderData: keepPreviousData,
  });
}

export function tournamentTeamsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_teams`, { id }],
    queryFn: () => fetchTournamentTeams(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentTeamsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_teams_count`, { id }],
    queryFn: () => fetchTournamentTeamsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentUsersQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_users`, { id }],
    queryFn: () => fetchTournamentUsers(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentUsersCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_users_count`, { id }],
    queryFn: () => fetchTournamentUsersCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentPoolCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_pool_count`, { id }],
    queryFn: () => fetchTournamentPoolsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function tournamentMatchesCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`tournament_matches_count`, { id }],
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
    if (LOG_ENABLED) console.log(`/api/tournaments/${id}`, res.data);
    return res.data;
  });
}

export async function fetchTournaments(): Promise<Tournament[]> {
  return axios.get<Tournament[]>(`/api/tournaments`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/tournaments`, res.data);
    return res.data;
  });
}

export async function fetchTournamentsCount(query: string): Promise<number> {
  return axios
    .get<Count>(`/api/tournaments/count?query=${query}`)
    .then((res) => {
      if (LOG_ENABLED)
        console.log(`/api/tournaments/count?query=${query}`, res.data);
      return res.data.count;
    });
}

export async function fetchTournamentTeams(id: string): Promise<Team[]> {
  return axios.get<Team[]>(`/api/tournaments/${id}/teams`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/tournaments/${id}/teams`, res.data);
    return res.data;
  });
}

export async function fetchTournamentTeamsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/teams/count`).then((res) => {
    if (LOG_ENABLED)
      console.log(`/api/tournaments/${id}/teams/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentUsers(
  id: string,
): Promise<TournamentUser[]> {
  return axios
    .get<TournamentUser[]>(`/api/tournaments/${id}/users`)
    .then((res) => {
      if (LOG_ENABLED) console.log(`/api/tournaments/${id}/users`, res.data);
      return res.data;
    });
}

export async function fetchTournamentUsersCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/users/count`).then((res) => {
    if (LOG_ENABLED)
      console.log(`/api/tournaments/${id}/users/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentPoolsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/tournaments/${id}/pools/count`).then((res) => {
    if (LOG_ENABLED)
      console.log(`/api/tournaments/${id}/pools/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTournamentMatchesCount(id: string): Promise<number> {
  return axios
    .get<Count>(`/api/tournaments/${id}/matches/count`)
    .then((res) => {
      if (LOG_ENABLED)
        console.log(`/api/tournaments/${id}/matches/count`, res.data);
      return res.data.count;
    });
}

export async function fetchTournamentPopular(): Promise<Tournament[]> {
  return axios.get<Tournament[]>("/api/tournaments/popular").then((res) => {
    if (LOG_ENABLED) console.log("/api/tournaments/popular", res.data);
    return res.data;
  });
}
