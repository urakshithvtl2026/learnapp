import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // ── Session helpers ────────────────────────────────────────────────────────

  private getSession(): SessionData | null {
    const raw = localStorage.getItem(this.SESSION_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw) as SessionData; } catch { return null; }
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async login(username: string, password: string): Promise<LoginResult> {
    await this.seedIfEmpty();
    const res = await firstValueFrom(
      this.http.post<{ result: LoginResult; role?: UserRole }>(
        `${this.baseUrl}/login`, { username, password }
      )
    );
    if (res.result === 'ok') {
      const session: SessionData = { username, role: res.role! };
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
    return res.result;
  }

  async signup(
    username: string,
    password: string,
    acceptKey: string
  ): Promise<{ success: boolean; error?: string }> {
    return firstValueFrom(
      this.http.post<{ success: boolean; error?: string }>(
        `${this.baseUrl}/signup`, { username, password, acceptKey }
      )
    );
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
    return firstValueFrom(
      this.http.get<UserInfo[]>(`${this.baseUrl}/users`)
    );
  }

  async setUserActive(username: string, isActive: boolean): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${this.baseUrl}/users/${username}/status`, { isActive })
    );
  }

  // ── One-time migration seed ───────────────────────────────────────────────
  // Call once to populate Firestore from the static JSON files.
  // Safe to call repeatedly — skips if users already exist.

  async seedIfEmpty(): Promise<void> {
    const existing = await this.getAllUsers();
    if (existing.length > 0) return;

    const [users, keys] = await Promise.all([
      firstValueFrom(this.http.get<User[]>('assets/data/users.json')),
      firstValueFrom(this.http.get<{ key: string; label: string }[]>('assets/data/registration-keys.json')),
    ]);

    await firstValueFrom(
      this.http.post(`${this.baseUrl}/seed`, { users, keys })
    );
  }
}
