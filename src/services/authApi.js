import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const toErrorMessage = (error) => {
  if (error instanceof Error) return error.message;
  return error?.response?.data?.message || "Request failed";
};

export const login = async (payload) => {
  if (!payload) return { error: "Missing payload" };
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};
