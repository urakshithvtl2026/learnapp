import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Word } from '../models/word.model';
import { ProgressService } from './progress.service';

@Injectable({ providedIn: 'root' })
export class WordService {
  private allWords: Word[] = [];

  private _activePool = signal<Word[]>([]);
  private _currentWord = signal<Word | null>(null);
  private _loaded = signal(false);

  readonly activePool = this._activePool.asReadonly();
  readonly currentWord = this._currentWord.asReadonly();
  readonly loaded = this._loaded.asReadonly();

  readonly remainingCount = computed(() => this._activePool().length);
  readonly isPoolEmpty = computed(() => this._activePool().length === 0);

  constructor(private http: HttpClient, private progress: ProgressService) {}

  async loadWords(): Promise<void> {
    const data = await firstValueFrom(
      this.http.get<Word[]>('assets/data/words.json')
    );
    this.allWords = data;
    await this.progress.loadProgress();
    this.buildActivePool();
    this._loaded.set(true);
    this.pickRandom();
  }

  buildActivePool(): void {
    const skipped = new Set(this.progress.getSkipped().map(w => w.id));
    const learnt = new Set(this.progress.getLearnt().map(w => w.id));
    const pool = this.allWords.filter(
      w => !skipped.has(w.id) && !learnt.has(w.id)
    );
    this._activePool.set(pool);
  }

  pickRandom(): void {
    const pool = this._activePool();
    if (pool.length === 0) {
      this._currentWord.set(null);
      return;
    }
    const current = this._currentWord();
    let candidates = pool;
    // Avoid showing the same word twice in a row if pool > 1
    if (current && pool.length > 1) {
      candidates = pool.filter(w => w.id !== current.id);
    }
    const idx = Math.floor(Math.random() * candidates.length);
    this._currentWord.set(candidates[idx]);
  }

  skipCurrent(): void {
    const word = this._currentWord();
    if (!word) return;
    this.progress.addSkipped(word);
    this._activePool.update(pool => pool.filter(w => w.id !== word.id));
    this.pickRandom();
  }

  markLearnt(): void {
    const word = this._currentWord();
    if (!word) return;
    this.progress.addLearnt(word);
    this._activePool.update(pool => pool.filter(w => w.id !== word.id));
    this.pickRandom();
  }

  next(): void {
    this.pickRandom();
  }

  resetSkipped(): void {
    this.progress.resetSkipped();
    this.buildActivePool();
    this.pickRandom();
  }

  resetLearnt(): void {
    this.progress.resetLearnt();
    this.buildActivePool();
    this.pickRandom();
  }

  resetAll(): void {
    this.progress.resetAll();
    this.buildActivePool();
    this.pickRandom();
  }

  getStats() {
    return {
      total: this.allWords.length,
      remaining: this._activePool().length,
      ...this.progress.getStats(),
    };
  }
}
