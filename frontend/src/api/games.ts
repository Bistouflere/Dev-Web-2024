import { Game } from "@/types/apiResponses";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";

export function gamesQueryOptions() {
  return queryOptions({
    queryKey: [`games`],
    queryFn: () => fetchGames(),
    placeholderData: keepPreviousData,
  });
}

export async function fetchGames(): Promise<Game[]> {
  return axios.get<Game[]>(`/api/games`).then((res) => {
    console.log(`/api/games`, res.data);
    return res.data;
  });
}
