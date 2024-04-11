import { Count, User, UserTeam, UserTournament } from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function userQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_${id}`, id],
    queryFn: () => fetchUser(id),
    placeholderData: keepPreviousData,
  });
}

export function usersQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`users_${query}_${page}`, query, page],
    queryFn: () => fetchUsers(query, page),
    placeholderData: keepPreviousData,
  });
}

export function usersCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`users_count_${query}`, query],
    queryFn: () => fetchUsersCount(query),
    placeholderData: keepPreviousData,
  });
}

export function userFollowersQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_followers_${id}`, id],
    queryFn: () => fetchUserFollowers(id),
    placeholderData: keepPreviousData,
  });
}

export function userFollowersCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_followers_count_${id}`, id],
    queryFn: () => fetchUserFollowersCount(id),
    placeholderData: keepPreviousData,
  });
}

export function userFollowingQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_following_${id}`, id],
    queryFn: () => fetchUserFollowing(id),
    placeholderData: keepPreviousData,
  });
}

export function userFollowingCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_following_count_${id}`, id],
    queryFn: () => fetchUserFollowingCount(id),
    placeholderData: keepPreviousData,
  });
}

export function userTeamsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_teams_${id}`, id],
    queryFn: () => fetchUserTeams(id),
    placeholderData: keepPreviousData,
  });
}

export function userTeamsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_teams_count_${id}`, id],
    queryFn: () => fetchUserTeamsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function userTournamentsQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_tournaments_${id}`, id],
    queryFn: () => fetchUserTournaments(id),
    placeholderData: keepPreviousData,
  });
}

export function userTournamentsCountQueryOptions(id: string) {
  return queryOptions({
    queryKey: [`user_tournaments_count_${id}`, id],
    queryFn: () => fetchUserTournamentsCount(id),
    placeholderData: keepPreviousData,
  });
}

export async function fetchUser(id: string): Promise<User> {
  const user = await axios
    .get<User>(`/api/users/${id}`)
    .then((res) => res.data);

  console.log(`/api/users/${id}`, user);
  return user;
}

export async function fetchUsers(query: string, page: number): Promise<User[]> {
  return axios
    .get<User[]>(`/api/users?page=${page}&query=${query}`)
    .then((res) => {
      console.log(`/api/users?page=${page}&query=${query}`, res.data);
      return res.data;
    });
}

export async function fetchUsersCount(query: string): Promise<number> {
  return axios.get<Count>(`/api/users/count?query=${query}`).then((res) => {
    console.log(`/api/users/count?query=${query}`, res.data);
    return res.data.count;
  });
}

export async function fetchUserFollowers(id: string): Promise<User[]> {
  return axios.get<User[]>(`/api/users/${id}/followers`).then((res) => {
    console.log(`/api/users/${id}/followers`, res.data);
    return res.data;
  });
}

export async function fetchUserFollowersCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/users/${id}/followers/count`).then((res) => {
    console.log(`/api/users/${id}/followers/count`, res.data);
    return res.data.count;
  });
}

export async function fetchUserFollowing(id: string): Promise<User[]> {
  return axios.get<User[]>(`/api/users/${id}/following`).then((res) => {
    console.log(`/api/users/${id}/following`, res.data);
    return res.data;
  });
}

export async function fetchUserFollowingCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/users/${id}/following/count`).then((res) => {
    console.log(`/api/users/${id}/following/count`, res.data);
    return res.data.count;
  });
}

export async function fetchUserTeams(id: string): Promise<UserTeam[]> {
  return axios.get<UserTeam[]>(`/api/users/${id}/teams`).then((res) => {
    console.log(`/api/users/${id}/teams`, res.data);
    return res.data;
  });
}

export async function fetchUserTeamsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/users/${id}/teams/count`).then((res) => {
    console.log(`/api/users/${id}/teams/count`, res.data);
    return res.data.count;
  });
}

export async function fetchUserTournaments(
  id: string,
): Promise<UserTournament[]> {
  return axios
    .get<UserTournament[]>(`/api/users/${id}/tournaments`)
    .then((res) => {
      console.log(`/api/users/${id}/tournaments`, res.data);
      return res.data;
    });
}

export async function fetchUserTournamentsCount(id: string): Promise<number> {
  return axios.get<Count>(`/api/users/${id}/tournaments/count`).then((res) => {
    console.log(`/api/users/${id}/tournaments/count`, res.data);
    return res.data.count;
  });
}
