import { Count, User, UserTeam, UserTournament } from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function userQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`users`, { id }],
    queryFn: () => fetchUser(id),
    placeholderData: keepPreviousData,
  });
}

export function usersQueryOptions(query: string, page: number) {
  return queryOptions({
    queryKey: [`users`, { query, page }],
    queryFn: () => fetchUsers(query, page),
    placeholderData: keepPreviousData,
  });
}

export function usersCountQueryOptions(query: string) {
  return queryOptions({
    queryKey: [`users_count`, { query }],
    queryFn: () => fetchUsersCount(query),
    placeholderData: keepPreviousData,
  });
}

export function userFollowersQueryOptions(
  id: string | null | undefined,
  query: string,
  page: number,
) {
  return queryOptions({
    queryKey: [`followers`, { id, query, page }],
    queryFn: () => fetchUserFollowers(id, query, page),
    placeholderData: keepPreviousData,
  });
}

export function userFollowersCountQueryOptions(
  id: string | null | undefined,
  query: string = "",
) {
  return queryOptions({
    queryKey: [`followers_count`, { id, query }],
    queryFn: () => fetchUserFollowersCount(id, query),
    placeholderData: keepPreviousData,
  });
}

export function userFollowingQueryOptions(
  id: string | null | undefined,
  query: string,
  page: number,
) {
  return queryOptions({
    queryKey: [`following`, { id, query, page }],
    queryFn: () => fetchUserFollowing(id, query, page),
    placeholderData: keepPreviousData,
  });
}

export function userFollowingCountQueryOptions(
  id: string | null | undefined,
  query: string = "",
) {
  return queryOptions({
    queryKey: [`following_count`, { id, query }],
    queryFn: () => fetchUserFollowingCount(id, query),
    placeholderData: keepPreviousData,
  });
}

export function isFollowingQueryOptions(
  followerId: string | null | undefined,
  followedId: string | null | undefined,
) {
  return queryOptions({
    queryKey: [`is_following`, { followerId, followedId }],
    queryFn: () => isFollowing(followerId, followedId),
    placeholderData: keepPreviousData,
  });
}

export function userTeamsQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`user_teams`, { id }],
    queryFn: () => fetchUserTeams(id),
    placeholderData: keepPreviousData,
  });
}

export function userTeamsCountQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`user_teams_count`, { id }],
    queryFn: () => fetchUserTeamsCount(id),
    placeholderData: keepPreviousData,
  });
}

export function userTournamentsQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`user_tournaments`, { id }],
    queryFn: () => fetchUserTournaments(id),
    placeholderData: keepPreviousData,
  });
}

export function userTournamentsCountQueryOptions(
  id: string | null | undefined,
) {
  return queryOptions({
    queryKey: [`user_tournaments_count`, { id }],
    queryFn: () => fetchUserTournamentsCount(id),
    placeholderData: keepPreviousData,
  });
}

export async function fetchUser(id: string | null | undefined): Promise<User> {
  if (!id) {
    throw new Error("User ID is required to fetch user data.");
  }

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

export async function fetchUserFollowers(
  id: string | null | undefined,
  query: string,
  page: number,
): Promise<User[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user followers.");
  }

  return axios
    .get<User[]>(`/api/users/${id}/followers?page=${page}&query=${query}`)
    .then((res) => {
      console.log(
        `/api/users/${id}/followers?page=${page}&query=${query}`,
        res.data,
      );
      return res.data;
    });
}

export async function fetchUserFollowersCount(
  id: string | null | undefined,
  query?: string,
): Promise<number> {
  if (!id) {
    throw new Error("User ID is required to fetch user followers count.");
  }

  return axios
    .get<Count>(`/api/users/${id}/followers/count?query=${query}`)
    .then((res) => {
      console.log(`/api/users/${id}/followers/count?query=${query}`, res.data);
      return res.data.count;
    });
}

export async function fetchUserFollowing(
  id: string | null | undefined,
  query: string,
  page: number,
): Promise<User[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user following.");
  }

  return axios
    .get<User[]>(`/api/users/${id}/following?page=${page}&query=${query}`)
    .then((res) => {
      console.log(
        `/api/users/${id}/following?page=${page}&query=${query}`,
        res.data,
      );
      return res.data;
    });
}

export async function fetchUserFollowingCount(
  id: string | null | undefined,
  query?: string,
): Promise<number> {
  if (!id) {
    throw new Error("User ID is required to fetch user following count.");
  }

  return axios
    .get<Count>(`/api/users/${id}/following/count?query=${query}`)
    .then((res) => {
      console.log(`/api/users/${id}/following/count?query=${query}`, res.data);
      return res.data.count;
    });
}

export async function isFollowing(
  followerId: string | null | undefined,
  followedId: string | null | undefined,
): Promise<boolean> {
  if (!followerId || !followedId) {
    return false;
  }

  return axios
    .get<
      Record<string, boolean>
    >(`/api/users/${followerId}/following/${followedId}`)
    .then((res) => {
      console.log(`/api/users/${followerId}/following/${followedId}`, res.data);
      return res.data.isFollowing;
    });
}

export async function fetchUserTeams(
  id: string | null | undefined,
): Promise<UserTeam[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user teams.");
  }

  return axios.get<UserTeam[]>(`/api/users/${id}/teams`).then((res) => {
    console.log(`/api/users/${id}/teams`, res.data);
    return res.data;
  });
}

export async function fetchUserTeamsCount(
  id: string | null | undefined,
): Promise<number> {
  if (!id) {
    throw new Error("User ID is required to fetch user teams count.");
  }

  return axios.get<Count>(`/api/users/${id}/teams/count`).then((res) => {
    console.log(`/api/users/${id}/teams/count`, res.data);
    return res.data.count;
  });
}

export async function fetchUserTournaments(
  id: string | null | undefined,
): Promise<UserTournament[]> {
  return axios
    .get<UserTournament[]>(`/api/users/${id}/tournaments`)
    .then((res) => {
      console.log(`/api/users/${id}/tournaments`, res.data);
      return res.data;
    });
}

export async function fetchUserTournamentsCount(
  id: string | null | undefined,
): Promise<number> {
  if (!id) {
    throw new Error("User ID is required to fetch user tournaments count.");
  }

  return axios.get<Count>(`/api/users/${id}/tournaments/count`).then((res) => {
    console.log(`/api/users/${id}/tournaments/count`, res.data);
    return res.data.count;
  });
}
