import type { components, operations } from "./api-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// A generic fetcher function
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // In a real app, you'd handle errors more gracefully
    const error = await response.json();
    throw new Error(error.detail || "An API error occurred");
  }

  // For successful responses, we assume the body is JSON and parse it
  return response.json() as Promise<T>;
}

// Define the type for the login function's request body
type LoginRequestBody = components["schemas"]["LoginInputBody"];

// Define the type for the successful login response (200 OK)
type LoginSuccessResponse =
  operations["get-user-login"]["responses"][200]["content"]["application/json"];

// Define the type for the successful "get me" response
type GetMeSuccessResponse =
  operations["get-user-details"]["responses"][200]["content"]["application/json"];

export const apiClient = {
  login: (data: LoginRequestBody): Promise<LoginSuccessResponse> => {
    return fetcher("/api/v1/users/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: (token: string): Promise<GetMeSuccessResponse> => {
    return fetcher("/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  // Add other API methods here following the same pattern
};
