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
      result.data.message || "An error occurred while following the user.",
    );
  }
}

export async function unfollowUser(
  userId: string,
  getToken: () => Promise<string | null>,
  invalidateQueries: () => void,
) {
  const token = await getToken();
  const result = await axios.delete(`/api/users/${userId}/unfollow`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (result.status === 200) {
    invalidateQueries();
    return true;
  } else {
    throw new Error(
      result.data.message || "An error occurred while unfollowing the user.",
    );
  }
}
