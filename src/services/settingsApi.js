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

export const getSettings = async () => {
  try {
    return await requestJson("/api/settings");
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};

export const saveSettings = async (payload) => {
  if (!payload) return { error: "Missing payload" };
  try {
    return await requestJson("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};
