import type { components, operations } from "./api-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.niyam.dev";

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An API error occurred");
  }
  const text = await response.text();
  // Return an empty object for 204 No Content responses
  if (response.status === 204 || !text) {
    return {} as T;
  }
  return JSON.parse(text);
}

// --- Type Aliases for Clarity ---
type LoginRequestBody = components["schemas"]["LoginInputBody"];
type CreateUserRequestBody = components["schemas"]["CreateUserInputBody"];
type UserLoginSuccessResponse =
  operations["get-user-login"]["responses"][200]["content"]["application/json"];
type AdminLoginSuccessResponse =
  operations["get-admin-login"]["responses"][200]["content"]["application/json"];
type UserSignupSuccessResponse =
  operations["post-create-user"]["responses"][201]["content"]["application/json"];
type GetMeUserSuccessResponse =
  operations["get-user-details"]["responses"][200]["content"]["application/json"];
type GetMeAdminSuccessResponse =
  operations["get-current-admin"]["responses"][200]["content"]["application/json"];
type GetFeedSuccessResponse =
  operations["get-public-feed"]["responses"][200]["content"]["application/json"];
type LogoutSuccessResponse =
  operations["post-logout"]["responses"][200]["content"]["application/json"];

export const apiClient = {
  login: (data: LoginRequestBody): Promise<UserLoginSuccessResponse> => {
    return fetcher(`/api/v1/users/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  adminLogin: (data: LoginRequestBody): Promise<AdminLoginSuccessResponse> => {
    return fetcher(`/api/v1/admin/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signup: (data: CreateUserRequestBody): Promise<UserSignupSuccessResponse> => {
    return fetcher(`/api/v1/users/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // For regular users
  getMe: (token: string): Promise<GetMeUserSuccessResponse> => {
    return fetcher(`/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // New specific method for admins
  getCurrentAdmin: (token: string): Promise<GetMeAdminSuccessResponse> => {
    return fetcher(`/api/v1/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // New method to get the article feed
  getFeed: (page = 1, limit = 10): Promise<GetFeedSuccessResponse> => {
    return fetcher(`/api/v1/feed?page=${page}&limit=${limit}&filter=recent`);
  },

  logout: (): Promise<LogoutSuccessResponse> => {
    return fetcher(`/api/v1/logout`, { method: "POST" });
  },
};
