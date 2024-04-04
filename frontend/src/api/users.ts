import { FullUser, Team, Tournament, User } from "@/types/type";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function usersCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`users_count_${query}`, query],
    queryFn: () => fetchUsersCount(query),
    placeholderData: keepPreviousData,
  });
}

export function usersQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`users_page_${query}_${page}`, query, page],
    queryFn: () => fetchUsers(query, page),
    placeholderData: keepPreviousData,
  });
}

export function userQueryOptions(id: number) {
  return queryOptions({
    queryKey: [`user_${id}`, id],
    queryFn: () => fetchUser(id),
    placeholderData: keepPreviousData,
  });
}

export async function fetchUsersCount(query: string): Promise<number> {
  return axios
    .get<Record<string, number>>(`/api/users/count?query=${query}`)
    .then((res) => {
      console.log("count", res.data);
      return res.data.count;
    });
}

export async function fetchUsers(query: string, page: number): Promise<User[]> {
  return axios
    .get<User[]>(`/api/users?page=${page}&query=${query}`)
    .then((res) => {
      console.log("users", res.data);
      return res.data;
    });
}

export async function fetchUser(id: number): Promise<FullUser> {
  const user = await axios
    .get<User>(`/api/users/${id}`)
    .then((res) => res.data);
  const followers = await axios
    .get<User[]>(`/api/users/${id}/followers`)
    .then((res) => res.data);
  const following = await axios
    .get<User[]>(`/api/users/${id}/following`)
    .then((res) => res.data);
  const teams = await axios
    .get<Team[]>(`/api/users/${id}/teams`)
    .then((res) => res.data);
  const ownedTeam = await axios
    .get<Team>(`/api/users/${id}/teams/owned`)
    .then((res) => res.data);
  const tournament = await axios
    .get<Tournament>(`/api/users/${id}/tournaments`)
    .then((res) => res.data);
  const past_tournaments = await axios
    .get<Tournament[]>(`/api/users/${id}/tournaments/past`)
    .then((res) => res.data);

  const fullUser = {
    user,
    followers,
    following,
    teams,
    ownedTeam,
    tournament,
    past_tournaments,
  };

  console.log("fullUser", fullUser);
  return fullUser;
}
