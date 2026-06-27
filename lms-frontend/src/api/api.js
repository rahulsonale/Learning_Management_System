export const backendURL = import.meta.env.VITE_BACKEND_URL;

export function setImagePath(path) {
  if (path) {
    return `${backendURL}/${path}`;
  }
  return "";
}

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getErrorMessage(data) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message || data?.error || "Something went wrong. Please try again."
  );
}

function parseBody(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function mergeConfig(baseConfig, config) {
  return {
    ...baseConfig,
    ...config,
    headers: {
      ...baseConfig.headers,
      ...config.headers,
    },
  };
}

async function parseResponse(response) {
  const text = await response.text();
  const data = parseBody(text);

  if (!response.ok) {
    throw new ApiError(getErrorMessage(data), response.status, data);
  }

  return data;
}

async function request(endPoint, config = {}) {
  try {
    const response = await fetch(`${backendURL}/${endPoint}`, config);
    return await parseResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      "Unable to connect to the server. Please try again.",
      0,
      error,
    );
  }
}

async function post(endPoint, body, credentials = true, config = {}) {
  const baseConfig = {
    method: "POST",
    body: JSON.stringify(body),
    headers: DEFAULT_HEADERS,
  };

  if (credentials) {
    baseConfig.credentials = "include";
  }

  return request(endPoint, mergeConfig(baseConfig, config));
}

async function get(endPoint, credentials = true, config = {}) {
  const baseConfig = {
    headers: DEFAULT_HEADERS,
  };

  if (credentials) {
    baseConfig.credentials = "include";
  }

  return request(endPoint, mergeConfig(baseConfig, config));
}

export { post, get, ApiError };
