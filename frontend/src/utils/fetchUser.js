import api from "../api";

export const fetchCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    // backend returns the user object directly as the response body
    localStorage.setItem("user", JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // User is not logged in, this is expected
      return null;
    }
    console.error("Failed to fetch user:", error);
    // Clear invalid token and user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};