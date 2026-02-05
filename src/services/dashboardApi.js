const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const toErrorMessage = (error) => {
  if (error instanceof Error) return error.message;
  return "Request failed";
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
};

export const getDashboard = async () => {
  try {
    return await requestJson("/api/dashboard");
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};
