import { LOG_ENABLED } from "@/config";
import {
  Count,
  Invitation,
  User,
  UserTeam,
  UserTournament,
} from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function userQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`users`, { id }],
    queryFn: () => fetchUser(id),
    placeholderData: keepPreviousData,
  });
}

export function usersQueryOptions() {
  return queryOptions({
    queryKey: [`users`],
    queryFn: () => fetchUsers(),
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

export function userInvitationsQueryOptions(
  id: string | null | undefined,
  getToken: () => Promise<string | null>,
) {
  return queryOptions({
    queryKey: [`user_invitations`, { id }],
    queryFn: () => fetchUserInvitations(id, getToken),
    placeholderData: keepPreviousData,
  });
}

export function userSentInvitationsQueryOptions(
  id: string | null | undefined,
  getToken: () => Promise<string | null>,
) {
  return queryOptions({
    queryKey: [`user_sent_invitations`, { id }],
    queryFn: () => fetchUserSentInvitations(id, getToken),
    placeholderData: keepPreviousData,
  });
}

export function userFollowersQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`followers`, { id }],
    queryFn: () => fetchUserFollowers(id),
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

export function userFollowingQueryOptions(id: string | null | undefined) {
  return queryOptions({
    queryKey: [`following`, { id }],
    queryFn: () => fetchUserFollowing(id),
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
  if (LOG_ENABLED) console.log(`/api/users/${id}`, user);
  return user;
}

export async function fetchUsers(): Promise<User[]> {
  return axios.get<User[]>(`/api/users`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/users`, res.data);
    return res.data;
  });
}

export async function fetchUsersCount(query: string): Promise<number> {
  return axios.get<Count>(`/api/users/count?query=${query}`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/users/count?query=${query}`, res.data);
    return res.data.count;
  });
}

export async function fetchUserInvitations(
  id: string | null | undefined,
  getToken: () => Promise<string | null>,
): Promise<Invitation[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user invitations.");
  }

  const token = await getToken();

  return axios
    .get<Invitation[]>(`/api/invitations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (LOG_ENABLED) console.log(`/api/invitations`, res.data);
      return res.data;
    });
}

export async function fetchUserSentInvitations(
  id: string | null | undefined,
  getToken: () => Promise<string | null>,
): Promise<Invitation[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user sent invitations.");
  }

  const token = await getToken();

  return axios
    .get<Invitation[]>(`/api/invitations/sent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (LOG_ENABLED) console.log(`/api/invitations/sent`, res.data);
      return res.data;
    });
}

export async function fetchUserFollowers(
  id: string | null | undefined,
): Promise<User[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user followers.");
  }

  return axios.get<User[]>(`/api/users/${id}/followers`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/users/${id}/followers`, res.data);
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
      if (LOG_ENABLED)
        console.log(
          `/api/users/${id}/followers/count?query=${query}`,
          res.data,
        );
      return res.data.count;
    });
}

export async function fetchUserFollowing(
  id: string | null | undefined,
): Promise<User[]> {
  if (!id) {
    throw new Error("User ID is required to fetch user following.");
  }

  return axios.get<User[]>(`/api/users/${id}/following`).then((res) => {
    if (LOG_ENABLED) console.log(`/api/users/${id}/following`, res.data);
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
      if (LOG_ENABLED)
        console.log(
          `/api/users/${id}/following/count?query=${query}`,
          res.data,
        );
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
      if (LOG_ENABLED)
        console.log(
          `/api/users/${followerId}/following/${followedId}`,
          res.data,
        );
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
    if (LOG_ENABLED) console.log(`/api/users/${id}/teams`, res.data);
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
    if (LOG_ENABLED) console.log(`/api/users/${id}/teams/count`, res.data);
    return res.data.count;
  });
}

export async function fetchUserTournaments(
  id: string | null | undefined,
): Promise<UserTournament[]> {
  return axios
    .get<UserTournament[]>(`/api/users/${id}/tournaments`)
    .then((res) => {
      if (LOG_ENABLED) console.log(`/api/users/${id}/tournaments`, res.data);
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
    if (LOG_ENABLED)
      console.log(`/api/users/${id}/tournaments/count`, res.data);
    return res.data.count;
  });
}
