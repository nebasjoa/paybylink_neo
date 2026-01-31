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

export const listPaymentLinks = async () => {
  try {
    return await requestJson("/api/payment-links");
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};

export const getPaymentLink = async (id) => {
  if (!id) return { error: "Missing payment link id" };
  try {
    return await requestJson(`/api/payment-links/${id}`);
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};

export const createPaymentLink = async (payload) => {
  if (!payload) return { error: "Missing payload" };
  try {
    return await requestJson("/api/payment-links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return { error: toErrorMessage(error) };
  }
};
