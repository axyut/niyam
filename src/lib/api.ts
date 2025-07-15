import type { components, operations } from "./api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://niyamapi.achyutkoirala.com.np";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An API error occurred");
  }

  // Handle cases where the response body might be empty (e.g., on logout)
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}

type LoginRequestBody = components["schemas"]["LoginInputBody"];
type LoginSuccessResponse =
  operations["get-user-login"]["responses"][200]["content"]["application/json"];
type GetMeSuccessResponse =
  operations["get-user-details"]["responses"][200]["content"]["application/json"];
type LogoutSuccessResponse =
  operations["post-logout"]["responses"][200]["content"]["application/json"];

export const apiClient = {
  login: (data: LoginRequestBody): Promise<LoginSuccessResponse> => {
    return fetcher(`/api/v1/users/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: (token: string): Promise<GetMeSuccessResponse> => {
    return fetcher(`/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  logout: (): Promise<LogoutSuccessResponse> => {
    return fetcher(`/api/v1/logout`, {
      method: "POST",
    });
  },
};
