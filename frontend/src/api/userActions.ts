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

export async function removeUserFromTeam(
  userId: string,
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/teams/${teamId}/users/${userId}`, {
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

export async function addTeamToTournament(
  teamId: string,
  tournamentId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.post(
      `/api/tournaments/${tournamentId}/teams/${teamId}`,
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

export async function removeTeamFromTournament(
  teamId: string,
  tournamentId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/tournaments/${tournamentId}/teams/${teamId}`, {
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

export async function addUserToTournament(
  userId: string,
  tournamentId: string,
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.post(
      `/api/tournaments/${tournamentId}/teams/${teamId}/users/${userId}`,
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

export async function removeUserFromTournament(
  userId: string,
  tournamentId: string,
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(
      `/api/tournaments/${tournamentId}/teams/${teamId}/users/${userId}`,
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

export async function updateTeam(
  teamId: string,
  formData: globalThis.FormData,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.put<Promise<Team>>(
      `/api/teams/${teamId}`,
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

export async function deleteTeam(
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/teams/${teamId}`, {
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

export async function updateTournament(
  tournamentId: string,
  formData: globalThis.FormData,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.put<Promise<Tournament>>(
      `/api/tournaments/${tournamentId}`,
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

export async function updateTournamentStatus(
  tournamentId: string,
  status: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    const response = await axios.put<Promise<Tournament>>(
      `/api/tournaments/${tournamentId}/status/${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

export async function deleteTournament(
  tournamentId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/tournaments/${tournamentId}`, {
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

export async function inviteUser(
  userId: string,
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.post(
      `/api/invitations/send/${userId}/${teamId}`,
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

export async function acceptInvitation(
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/invitations/accept/${teamId}`, {
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

export async function rejectInvitation(
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/invitations/reject/${teamId}`, {
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

export async function cancelInvitation(
  userId: string,
  teamId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();

  try {
    await axios.delete(`/api/invitations/cancel/${userId}/${teamId}`, {
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
