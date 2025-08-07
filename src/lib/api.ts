import type { components, operations } from "./api-types";
import { useAuthStore } from "./store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.niyam.dev";

// The fetcher needs to be updated to handle different Content-Types
async function fetcher<T>(
  url: string,
  options?: RequestInit,
  isFormData = false
): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options?.headers);

  // Don't set Content-Type for FormData; the browser does it automatically with the correct boundary
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "An API error occurred");
  }
  const text = await response.text();
  if (response.status === 204 || !text) {
    return {} as T;
  }
  return JSON.parse(text);
}

// --- Type Aliases ---
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
type GetArticleBySlugSuccessResponse =
  operations["get-article-by-slug"]["responses"][200]["content"]["application/json"];
type LogoutSuccessResponse =
  operations["post-logout"]["responses"][200]["content"]["application/json"];
type SearchSuccessResponse =
  operations["search-articles"]["responses"][200]["content"]["application/json"];
type GetPublicDocumentsSuccessResponse =
  operations["get-all-public-documents"]["responses"][200]["content"]["application/json"];
type GetDocumentByIdSuccessResponse =
  operations["get-document-by-id"]["responses"][200]["content"]["application/json"];
type GetStructuredDocumentSuccessResponse =
  operations["get-structured-document"]["responses"][200]["content"]["application/json"];
type GetAllProfessionalsSuccessResponse =
  operations["get-all-professionals"]["responses"][200]["content"]["application/json"];
type GetProfessionalByIdSuccessResponse =
  operations["get-professional-by-id"]["responses"][200]["content"]["application/json"];
type ProcessDocumentSuccessResponse =
  operations["process-new-document"]["responses"][200]["content"]["application/json"];
type GetMyLegalDocumentsSuccessResponse =
  operations["get-my-documents"]["responses"][200]["content"]["application/json"];

export const apiClient = {
  getMyLegalDocuments: (): Promise<GetMyLegalDocumentsSuccessResponse> => {
    return fetcher(`/api/v1/documents/me`);
  },
  processNewDocument: (
    file: File,
    documentType: string
  ): Promise<ProcessDocumentSuccessResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    // Pass the FormData directly to the body and set the isFormData flag
    return fetcher(
      `/api/v1/documents`,
      {
        method: "POST",
        body: formData,
      },
      true
    );
  },
  getAllProfessionals: (
    page = 1,
    limit = 20
  ): Promise<GetAllProfessionalsSuccessResponse> => {
    return fetcher(`/api/v1/professionals?page=${page}&limit=${limit}`);
  },
  getProfessionalById: (
    id: string
  ): Promise<GetProfessionalByIdSuccessResponse> => {
    return fetcher(`/api/v1/professionals/${id}`);
  },
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
  getMe: (token: string): Promise<GetMeUserSuccessResponse> => {
    return fetcher(`/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  getCurrentAdmin: (token: string): Promise<GetMeAdminSuccessResponse> => {
    return fetcher(`/api/v1/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // FIX: Updated getFeed to accept filter and sortOrder parameters
  getFeed: (
    page = 1,
    limit = 10,
    filter: "trending" | "recent" | "popular" = "trending",
    sortOrder: "asc" | "desc" = "desc"
  ): Promise<GetFeedSuccessResponse> => {
    return fetcher(
      `/api/v1/feed?page=${page}&limit=${limit}&filter=${filter}&sortOrder=${sortOrder}`
    );
  },

  getArticleBySlug: (
    slug: string
  ): Promise<GetArticleBySlugSuccessResponse> => {
    return fetcher(`/api/v1/articles/${slug}`);
  },
  recordArticleView: (articleId: string): Promise<void> => {
    // This is a "fire-and-forget" call, so we don't need to handle the response
    return fetcher(`/api/v1/articles/${articleId}/view`, { method: "POST" });
  },

  searchArticles: (
    query: string,
    limit = 5
  ): Promise<SearchSuccessResponse> => {
    return fetcher(
      `/api/v1/articles/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  },

  searchDocuments: (
    query: string,
    limit = 5
  ): Promise<SearchSuccessResponse> => {
    return fetcher(
      `/api/v1/documents/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  },

  searchProfessionals: (
    query: string,
    limit = 5
  ): Promise<SearchSuccessResponse> => {
    return fetcher(
      `/api/v1/professionals/search?q=${encodeURIComponent(
        query
      )}&limit=${limit}`
    );
  },

  searchDictionary: (
    query: string,
    limit = 5
  ): Promise<SearchSuccessResponse> => {
    return fetcher(
      `/api/v1/dictionary/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  },

  getAllPublicDocuments: (
    page = 1,
    limit = 20
  ): Promise<GetPublicDocumentsSuccessResponse> => {
    return fetcher(`/api/v1/documents?page=${page}&limit=${limit}`);
  },

  getDocumentById: (
    documentId: string
  ): Promise<GetDocumentByIdSuccessResponse> => {
    return fetcher(`/api/v1/documents/${documentId}`);
  },

  getStructuredDocument: (
    documentId: string
  ): Promise<GetStructuredDocumentSuccessResponse> => {
    return fetcher(`/api/v1/documents/structured/${documentId}`);
  },

  logout: (): Promise<LogoutSuccessResponse> => {
    return fetcher(`/api/v1/logout`, { method: "POST" });
  },
};
