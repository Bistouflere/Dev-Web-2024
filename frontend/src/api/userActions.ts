import { Team, Tournament } from "@/types/apiResponses";
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
  formData: globalThis.FormData,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.post<Promise<Team>>(`/api/teams`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
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

export async function createTournament(
  formData: globalThis.FormData,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.post<Promise<Tournament>>(
      `/api/tournaments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

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
