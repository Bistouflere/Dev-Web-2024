import { UserProfile } from "@/types/user";
import { APIResult } from "@/types/users";
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

export async function fetchUsers(
  query: string,
  page: number,
): Promise<APIResult> {
  return axios
    .get<APIResult>(`/api/users?page=${page}&query=${query}`)
    .then((res) => {
      console.log("users", res.data);
      return res.data;
    });
}

export async function fetchUser(id: number): Promise<UserProfile> {
  const user = await axios
    .get<UserProfile>(`/api/users/${id}`)
    .then((res) => res.data);

  console.log("fullUser", user);
  return user;
}

export async function addFollow(followerid: string, followedid: string) {
  axios.post('/api/users/follow', {followerid, followedid})
  .then(response => {
    console.log(response)
  })
  .catch(error => {
    console.error('Error following user:', error.message);
  })
}