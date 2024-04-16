import { Team } from "@/types/apiResponses";
import axios, { AxiosError } from "axios";

export async function followUser(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.post(
      `/api/users/${userId}/follow`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    invalidateQueries();
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error((error as Error).message);
    }
  }
}

export async function unfollowUser(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/users/${userId}/follow`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    invalidateQueries();
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error((error as Error).message);
    }
  }
}

export async function joinTeam(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.post(
      `/api/teams/${userId}/users`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    invalidateQueries();
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error((error as Error).message);
    }
  }
}

export async function leaveTeam(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/teams/${userId}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    invalidateQueries();
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error((error as Error).message);
    }
  }
}

export async function createTeam(
  data: {
    team_name: string;
    team_description: string;
    team_image_url?: string;
  },
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.post<Promise<Team>>(`/api/teams`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    invalidateQueries();
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error((error as Error).message);
    }
  }
}
