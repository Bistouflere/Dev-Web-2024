import axios from "axios";

export async function followUser(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();
  const result = await axios.post(
    `/api/users/${userId}/follow`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (result.status === 201) {
    invalidateQueries();
    return true;
  } else {
    throw new Error(
      result.data.error || "An error occurred while following the user.",
    );
  }
}

export async function unfollowUser(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();
  const result = await axios.delete(`/api/users/${userId}/follow`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) {
    invalidateQueries();
    return true;
  } else {
    throw new Error(
      result.data.error || "An error occurred while unfollowing the user.",
    );
  }
}

export async function joinTeam(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();
  const result = await axios.post(
    `/api/teams/${userId}/users`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (result.status === 201) {
    invalidateQueries();
    return true;
  } else {
    throw new Error(
      result.data.error || "An error occurred while joining the team.",
    );
  }
}

export async function leaveTeam(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();
  const result = await axios.delete(`/api/teams/${userId}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) {
    invalidateQueries();
    return true;
  } else {
    throw new Error(
      result.data.error || "An error occurred while leaving the team.",
    );
  }
}
