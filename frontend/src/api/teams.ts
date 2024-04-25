import {
  Count,
  Team,
  TeamUser,
  Tournament,
  TournamentUser,
} from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function teamQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`teams`, { id }],
    queryFn: () => fetchTeam(id),
    placeholderData: keepPreviousData,
  });
}

export function teamsQueryOptions() {
  return queryOptions({
    queryKey: [`teams`],
    queryFn: () => fetchTeams(),
    placeholderData: keepPreviousData,
  });
}

export function teamsCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`teams_count`, { query }],
    queryFn: () => fetchTeamsCount(query),
    placeholderData: keepPreviousData,
  });
}

export function teamUsersQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_users`, { id }],
    queryFn: () => fetchTeamUsers(id),
    placeholderData: keepPreviousData,
  });
}

export function teamUsersCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_users_count`, { id }],
    queryFn: () => fetchTeamUsersCount(id),
    placeholderData: keepPreviousData,
  });
}

export function teamTournamentsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_tournaments`, { id }],
    queryFn: () => fetchTeamTournaments(id),
    placeholderData: keepPreviousData,
  });
}

export function teamTournamentsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_tournaments_count`, { id }],
    queryFn: () => fetchTeamTournamentsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function teamTournamentUsersQueryOptions(
  id: string,
  tournamentId: string,
) {
  return queryOptions({
    queryKey: [`team_tournament_users`, { id, tournamentId }],
    queryFn: () => fetchTeamTournamentUsers(id, tournamentId),
    placeholderData: keepPreviousData,
  });
}

export async function fetchTeam(id: string): Promise<Team> {
  return axios.get<Team>(`/api/teams/${id}`).then((res) => {
    console.log(`/api/teams/${id}`, res.data);
    return res.data;
  });
}

export async function fetchTeams(): Promise<Team[]> {
  return axios.get<Team[]>(`/api/teams`).then((res) => {
    console.log(`/api/teams`, res.data);
    return res.data;
  });
}

export async function fetchTeamsCount(query: string): Promise<number> {
  return axios.get<Count>(`/api/teams/count?query=${query}`).then((res) => {
    console.log(`/api/teams/count?query=${query}`, res.data);
    return res.data.count;
  });
}

export async function fetchTeamUsers(id: string): Promise<TeamUser[]> {
  return axios.get<TeamUser[]>(`/api/teams/${id}/users`).then((res) => {
    console.log(`/api/teams/${id}/users`, res.data);
    return res.data;
  });
}

export async function fetchTeamUsersCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/teams/${id}/users/count`).then((res) => {
    console.log(`/api/teams/${id}/users/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTeamTournaments(id: string): Promise<Tournament[]> {
  return axios.get<Tournament[]>(`/api/teams/${id}/tournaments`).then((res) => {
    console.log(`/api/teams/${id}/tournaments`, res.data);
    return res.data;
  });
}

export async function fetchTeamTournamentsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/teams/${id}/tournaments/count`).then((res) => {
    console.log(`/api/teams/${id}/tournaments/count`, res.data);
    return res.data.count;
  });
}

export async function fetchTeamTournamentUsers(
  id: string,
  tournamentId: string,
): Promise<TournamentUser[]> {
  return axios
    .get<TournamentUser[]>(`/api/teams/${id}/tournaments/${tournamentId}/users`)
    .then((res) => {
      console.log(
        `/api/teams/${id}/tournaments/${tournamentId}/users`,
        res.data,
      );
      return res.data;
    });
}
