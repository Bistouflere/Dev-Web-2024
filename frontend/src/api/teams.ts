import { Count, Team, TeamUser, Tournament } from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function teamQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_${id}`, id],
    queryFn: () => fetchTeam(id),
    placeholderData: keepPreviousData,
  });
}

export function teamsQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`teams_${query}_${page}`, query, page],
    queryFn: () => fetchTeams(query, page),
    placeholderData: keepPreviousData,
  });
}

export function teamsCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`teams_count_${query}`, query],
    queryFn: () => fetchTeamsCount(query),
    placeholderData: keepPreviousData,
  });
}

export function teamUsersQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_users_${id}`, id],
    queryFn: () => fetchTeamUsers(id),
    placeholderData: keepPreviousData,
  });
}

export function teamUsersCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_users_count_${id}`, id],
    queryFn: () => fetchTeamUsersCount(id),
    placeholderData: keepPreviousData,
  });
}

export function teamTournamentsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_tournaments_${id}`, id],
    queryFn: () => fetchTeamTournaments(id),
    placeholderData: keepPreviousData,
  });
}

export function teamTournamentsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`team_tournaments_count_${id}`, id],
    queryFn: () => fetchTeamTournamentsCount(id),
    placeholderData: keepPreviousData,
  });
}

export async function fetchTeam(id: string): Promise<Team> {
  return axios.get<Team>(`/api/teams/${id}`).then((res) => {
    console.log(`/api/teams/${id}`, res.data);
    return res.data;
  });
}

export async function fetchTeams(query: string, page: number): Promise<Team[]> {
  return axios
    .get<Team[]>(`/api/teams?page=${page}&query=${query}`)
    .then((res) => {
      console.log(`/api/teams?page=${page}&query=${query}`, res.data);
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
