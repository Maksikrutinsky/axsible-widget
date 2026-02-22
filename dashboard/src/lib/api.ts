import { API_BASE, TOKEN_KEY } from "./constants";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  Site,
  SiteCreate,
  SiteConfig,
  ConfigUpdate,
  Issue,
  AdminDashboard,
} from "../types/api";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit & { skipAuthRedirect?: boolean } = {}): Promise<T> {
  const { skipAuthRedirect, ...fetchOptions } = options;
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (res.status === 401 && !skipAuthRedirect) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const auth = {
  login: (data: LoginRequest) =>
    request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuthRedirect: true,
    }),
  register: (data: RegisterRequest) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      skipAuthRedirect: true,
    }),
  me: () => request<User>("/api/auth/me"),
};

export const sites = {
  list: () => request<Site[]>("/api/sites"),
  create: (data: SiteCreate) =>
    request<Site>("/api/sites", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  remove: (id: number) =>
    request<void>(`/api/sites/${id}`, { method: "DELETE" }),
};

export const config = {
  get: (siteId: number) =>
    request<SiteConfig>(`/api/sites/${siteId}/config`),
  update: (siteId: number, data: ConfigUpdate) =>
    request<SiteConfig>(`/api/sites/${siteId}/config`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

export const issues = {
  list: (siteId: number) =>
    request<Issue[]>(`/api/sites/${siteId}/issues`),
};

export const admin = {
  dashboard: () => request<AdminDashboard>("/api/admin/dashboard"),
  users: () => request<User[]>("/api/admin/users"),
  approveUser: (id: number) =>
    request<User>(`/api/admin/users/${id}/approve`, { method: "PATCH" }),
  revokeUser: (id: number) =>
    request<User>(`/api/admin/users/${id}/revoke`, { method: "PATCH" }),
  sites: () => request<Site[]>("/api/admin/sites"),
  issues: () => request<Issue[]>("/api/admin/issues"),
};
