import type { components, operations } from "./api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://niyamapi.achyutkoirala.com.np";

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
  return text ? JSON.parse(text) : ({} as T);
}

// Type definitions from OpenAPI spec
type LoginRequestBody = components["schemas"]["LoginInputBody"];
type CreateUserRequestBody = components["schemas"]["CreateUserInputBody"];
type UserLoginSuccessResponse =
  operations["get-user-login"]["responses"][200]["content"]["application/json"];
type AdminLoginSuccessResponse =
  operations["get-admin-login"]["responses"][200]["content"]["application/json"];
type UserSignupSuccessResponse =
  operations["post-create-user"]["responses"][201]["content"]["application/json"];

// FIX: Define the correct response types for getMe and logout
type GetMeSuccessResponse =
  operations["get-user-details"]["responses"][200]["content"]["application/json"];
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

  // FIX: The getMe function is now correctly typed to ONLY return a user,
  // as defined by the /api/v1/users/me endpoint in your spec.
  getMe: (token: string): Promise<GetMeSuccessResponse> => {
    return fetcher(`/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // FIX: The logout function is now correctly typed.
  logout: (): Promise<LogoutSuccessResponse> => {
    return fetcher(`/api/v1/logout`, { method: "POST" });
  },
};
