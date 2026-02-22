export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface SiteCreate {
  domain: string;
}

export interface Site {
  id: number;
  domain: string;
  license_key: string;
  status: string;
  created_at: string;
}

export interface ModulesConfig {
  enabled: string[];
  disabled: string[];
}

export interface ConfigUpdate {
  language?: string;
  position?: string;
  offset_x?: number;
  offset_y?: number;
  icon_color?: string;
  icon_size?: string;
  statement_he?: string;
  statement_en?: string;
  modules?: ModulesConfig;
}

export interface SiteConfig {
  id: number;
  site_id: number;
  language: string;
  position: string;
  offset_x: number;
  offset_y: number;
  icon_color: string;
  icon_size: string;
  statement_he: string;
  statement_en: string;
  modules: Record<string, unknown>;
}

export interface Issue {
  id: number;
  site_id: number | null;
  reporter_name: string;
  reporter_email: string;
  type: string;
  description: string;
  page_url: string;
  created_at: string;
}

export interface AdminDashboard {
  total_users: number;
  approved_users: number;
  pending_users: number;
  total_sites: number;
  active_sites: number;
  total_issues: number;
}
