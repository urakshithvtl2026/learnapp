import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export type UserRole = 'admin' | 'user' | 'examuser';
export type LoginResult = 'ok' | 'invalid' | 'inactive';

export interface User {
  username: string;
  password: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UserInfo {
  username: string;
  role: UserRole;
  isActive: boolean;
}

interface SessionData {
  username: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'lang_learn_user';

  constructor(private supabase: SupabaseService) {}

  // ── Session helpers ────────────────────────────────────────────────────────

  private getSession(): SessionData | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as SessionData; } catch { return null; }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<LoginResult> {
    const res = await this.supabase.login(username, password);
    if (res.result === 'ok') {
      const session: SessionData = { username, role: res.role as UserRole };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    return res.result as LoginResult;
  }

  async signup(
    username: string,
    password: string,
    acceptKey: string
  ): Promise<{ success: boolean; error?: string }> {
    return this.supabase.signup(username, password, acceptKey);
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_KEY);
  }

  getUsername(): string | null {
    return this.getSession()?.username ?? null;
  }

  getRole(): UserRole | null {
    return this.getSession()?.role ?? null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  // ── User management (admin only) ──────────────────────────────────────────

  async getAllUsers(): Promise<UserInfo[]> {
    const rows = await this.supabase.getUsers();
    return rows.map(r => ({
      username: r.username,
      role: r.role as UserRole,
      isActive: r.is_active,
    }));
  }

  async setUserActive(username: string, isActive: boolean): Promise<void> {
    await this.supabase.setUserActive(username, isActive);
  }
}
