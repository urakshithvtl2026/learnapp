import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private db: SupabaseClient;

  constructor() {
    this.db = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // AUTH — login
  async login(username: string, password: string) {
    const { data, error } = await this.db
      .from('auth_users')
      .select('role, is_active')
      .eq('username', username)
      .eq('password', password)
      .single();
    if (error || !data) return { result: 'invalid' };
    if (!data.is_active) return { result: 'inactive' };
    return { result: 'ok', role: data.role };
  }

  // AUTH — signup
  async signup(username: string, password: string, acceptKey: string) {
    // 1. Validate key
    const { data: key } = await this.db
      .from('registration_keys')
      .select('used')
      .eq('key', acceptKey)
      .single();
    if (!key) return { success: false, error: 'Invalid registration key.' };
    if (key.used)
      return {
        success: false,
        error: 'This registration key has already been used.',
      };

    // 2. Check username uniqueness
    const { data: existing } = await this.db
      .from('auth_users')
      .select('username')
      .eq('username', username)
      .single();
    if (existing)
      return { success: false, error: 'Username is already taken.' };

    // 3. Create user and mark key used
    await this.db
      .from('auth_users')
      .insert({ username, password, role: 'examuser', is_active: true });
    await this.db
      .from('registration_keys')
      .update({ used: true })
      .eq('key', acceptKey);
    return { success: true };
  }

  // PAPERS
  async getPapers() {
    const { data, error } = await this.db.from('papers').select('data');
    if (error) throw error;
    return data?.map((r) => r.data) ?? [];
  }

  async savePaper(paper: any) {
    const { error } = await this.db
      .from('papers')
      .upsert({ id: paper.id, data: paper });
    if (error) throw error;
    return { success: true };
  }

  async deletePaper(id: string) {
    const { error } = await this.db.from('papers').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // ASSIGNMENTS
  async getAssignments() {
    const { data, error } = await this.db.from('assignments').select('data');
    if (error) throw error;
    return data?.map((r) => r.data) ?? [];
  }

  async saveAssignment(assignment: any) {
    const { error } = await this.db
      .from('assignments')
      .upsert({ id: assignment.id, data: assignment });
    if (error) throw error;
    return { success: true };
  }

  async updateAssignment(id: string, changes: any) {
    const { data: existing } = await this.db
      .from('assignments')
      .select('data')
      .eq('id', id)
      .single();
    const updated = { ...existing?.data, ...changes };
    const { error } = await this.db
      .from('assignments')
      .update({ data: updated })
      .eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  async deleteAssignment(id: string) {
    const { error } = await this.db.from('assignments').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }

  // RESULTS
  async getResults() {
    const { data, error } = await this.db.from('results').select('data');
    if (error) throw error;
    return data?.map((r) => r.data) ?? [];
  }

  async saveResult(result: any) {
    const { error } = await this.db
      .from('results')
      .upsert({ id: result.id, data: result });
    if (error) throw error;
    return { success: true };
  }

  // PROGRESS
  async getProgress(username: string) {
    const { data, error } = await this.db
      .from('progress')
      .select('skipped, learnt')
      .eq('username', username)
      .single();
    if (error || !data) return { skipped: [], learnt: [] };
    return data;
  }

  async saveProgress(username: string, skipped: any[], learnt: any[]) {
    const { error } = await this.db
      .from('progress')
      .upsert({ username, skipped, learnt });
    if (error) throw error;
    return { success: true };
  }

  // USERS (admin)
  async getUsers() {
    const { data, error } = await this.db
      .from('auth_users')
      .select('id, username, role, is_active');
    if (error) throw error;
    return (data ?? []).map((r) => ({
      id: String(r.id ?? r.username),
      username: r.username,
      name: r.username,
      email: '',
      role: r.role as 'admin' | 'user',
      is_active: r.is_active,
    }));
  }

  async setUserActive(username: string, isActive: boolean) {
    const { error } = await this.db
      .from('auth_users')
      .update({ is_active: isActive })
      .eq('username', username);
    if (error) throw error;
    return { success: true };
  }
}
