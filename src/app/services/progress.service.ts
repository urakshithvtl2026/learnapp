import { Injectable, signal } from '@angular/core';
import { Word } from '../models/word.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private _skipped = signal<Word[]>([]);
  private _learnt = signal<Word[]>([]);

  constructor(private auth: AuthService, private supabase: SupabaseService) {}

  getSkipped(): Word[] {
    return this._skipped();
  }

  getLearnt(): Word[] {
    return this._learnt();
  }

  async loadProgress(): Promise<void> {
    const username = this.auth.getUsername();
    if (!username) return;
    try {
      const data = await this.supabase.getProgress(username);
      this._skipped.set(data.skipped ?? []);
      this._learnt.set(data.learnt ?? []);
    } catch {
      this._skipped.set([]);
      this._learnt.set([]);
    }
  }

  private save(): void {
    const username = this.auth.getUsername();
    if (!username) return;
    this.supabase.saveProgress(username, this._skipped(), this._learnt());
  }

  addSkipped(word: Word): void {
    if (!this._skipped().some(w => w.id === word.id)) {
      this._skipped.update(list => [...list, word]);
      this.save();
    }
  }

  addLearnt(word: Word): void {
    if (!this._learnt().some(w => w.id === word.id)) {
      this._learnt.update(list => [...list, word]);
    }
    // If a word is learnt, remove it from skipped too
    this._skipped.update(list => list.filter(w => w.id !== word.id));
    this.save();
  }

  resetSkipped(): void {
    this._skipped.set([]);
    this.save();
  }

  resetLearnt(): void {
    this._learnt.set([]);
    this.save();
  }

  resetAll(): void {
    this._skipped.set([]);
    this._learnt.set([]);
    this.save();
  }

  getStats(): { skipped: number; learnt: number } {
    return {
      skipped: this._skipped().length,
      learnt: this._learnt().length,
    };
  }
}
