import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  Assignment,
  ExamResult,
  ExamUser,
  QuestionForPlayer,
  QuestionPaper,
} from '../models/exam.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExamDataService {
  private http = inject(HttpClient);
  private api  = environment.apiUrl;

  readonly papers      = signal<QuestionPaper[]>([]);
  readonly assignments = signal<Assignment[]>([]);
  readonly results     = signal<ExamResult[]>([]);
  readonly users       = signal<ExamUser[]>([]);

  private initialized = false;

  readonly initError = signal<string>('');

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const [papers, assignments, results, users] = await Promise.all([
        firstValueFrom(this.http.get<QuestionPaper[]>(`${this.api}/papers`)),
        firstValueFrom(this.http.get<Assignment[]>(`${this.api}/assignments`)),
        firstValueFrom(this.http.get<ExamResult[]>(`${this.api}/results`)),
        firstValueFrom(this.http.get<ExamUser[]>(`${this.api}/users`)),
      ]);

      // First run — API returns empty → seed Firestore from local JSON assets
      if (papers.length === 0) await this.seedPapers();
      else this.papers.set(papers);

      if (users.length === 0) await this.seedUsers();
      else this.users.set(users);

      this.assignments.set(assignments);
      this.results.set(results);
      this.initialized = true;
      this.initError.set('');
    } catch (err: any) {
      const msg = err?.message ?? 'Unknown error';
      this.initError.set(`API connection failed: ${msg}. Make sure the Node.js API is running on ${this.api}`);
      console.error('[ExamDataService] initialize() failed:', err);
    }
  }

  // ── Papers ────────────────────────────────────────────────────────────────

  async savePaper(paper: QuestionPaper): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/papers`, paper));
    const list = [...this.papers()];
    const idx  = list.findIndex(p => p.id === paper.id);
    if (idx >= 0) list[idx] = paper; else list.push(paper);
    this.papers.set(list);
  }

  async deletePaper(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.api}/papers/${id}`));
    this.papers.set(this.papers().filter(p => p.id !== id));
  }

  getQuestionsForPlayer(paperId: string): QuestionForPlayer[] {
    const paper = this.papers().find(p => p.id === paperId);
    if (!paper) return [];
    return paper.questions.map(({ id, text, options }) => ({ id, text, options }));
  }

  // ── Assignments ───────────────────────────────────────────────────────────

  async saveAssignment(assignment: Assignment): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/assignments`, assignment));
    const list = [...this.assignments()];
    const idx  = list.findIndex(a => a.id === assignment.id);
    if (idx >= 0) list[idx] = assignment; else list.push(assignment);
    this.assignments.set(list);
  }

  // Partial update — only send changed fields
  async updateAssignment(id: string, changes: Partial<Assignment>): Promise<void> {
    await firstValueFrom(this.http.patch(`${this.api}/assignments/${id}`, changes));
    const list = this.assignments().map(a => a.id === id ? { ...a, ...changes } : a);
    this.assignments.set(list);
  }

  async deleteAssignment(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.api}/assignments/${id}`));
    this.assignments.set(this.assignments().filter(a => a.id !== id));
  }

  // ── Results ───────────────────────────────────────────────────────────────

  async saveResult(result: ExamResult): Promise<void> {
    await firstValueFrom(this.http.post(`${this.api}/results`, result));
    const list = [...this.results()];
    const idx  = list.findIndex(r => r.id === result.id);
    if (idx >= 0) list[idx] = result; else list.push(result);
    this.results.set(list);
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  getUserByUsername(username: string): ExamUser | undefined {
    return this.users().find(u => u.username === username);
  }

  generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  // ── Seeding (first run only — sends local JSON assets to API) ─────────────

  private async seedPapers(): Promise<void> {
    const paths = await firstValueFrom(
      this.http.get<string[]>('assets/data/exam/question-papers-index.json')
    );
    const papers = await Promise.all(
      paths.map(p => firstValueFrom(this.http.get<QuestionPaper>(p)))
    );
    await firstValueFrom(this.http.post(`${this.api}/papers/seed`, papers));
    this.papers.set(papers);
  }

  private async seedUsers(): Promise<void> {
    const users = await firstValueFrom(
      this.http.get<ExamUser[]>('assets/data/exam/users.json')
    );
    await firstValueFrom(this.http.post(`${this.api}/users/seed`, users));
    this.users.set(users);
  }
}
