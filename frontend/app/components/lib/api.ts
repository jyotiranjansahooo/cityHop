const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiOptions extends RequestInit {
  token?: string;
}

export const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> => {
  const { token, headers, ...requestOptions } = options;

  const requestHeaders = new Headers(headers);

  if (!(requestOptions.body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token) {
    requestHeaders.set("Authorization", "Bearer " + token);
  }

  const response = await fetch(API_URL + endpoint, {
    ...requestOptions,
    headers: requestHeaders,
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      throw new Error(data.message);
    }

    throw new Error("API request failed");
  }

  return data as T;
};
