import { Injectable, OnDestroy, signal } from '@angular/core';
import { TimerState } from '../models/exam.model';

@Injectable({ providedIn: 'root' })
export class ExamTimerService implements OnDestroy {
  private readonly KEY_PREFIX = 'exam_timer_';

  readonly remainingSeconds = signal<number>(0);
  readonly expired          = signal<boolean>(false);

  private assignmentId = '';
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private saveTickCount = 0;
  private onExpireCallback: (() => void) | null = null;

  /** Start (or resume) timer for the given assignment. */
  start(assignmentId: string, totalSeconds: number, onExpire: () => void): void {
    this.stop();

    this.assignmentId    = assignmentId;
    this.onExpireCallback = onExpire;
    this.expired.set(false);

    const saved = this.loadState(assignmentId);
    let remaining: number;

    if (saved) {
      // Recalculate remaining from wall-clock startedAt to prevent cheating
      const elapsed = Math.floor(
        (Date.now() - new Date(saved.startedAt).getTime()) / 1000
      );
      remaining = Math.max(0, totalSeconds - elapsed);
    } else {
      remaining = totalSeconds;
      this.saveState({ assignmentId, startedAt: new Date().toISOString(), remainingSeconds: remaining });
    }

    this.remainingSeconds.set(remaining);
    if (remaining === 0) { this.handleExpiry(); return; }

    this.intervalId = setInterval(() => {
      const next = this.remainingSeconds() - 1;
      this.remainingSeconds.set(next);

      // Persist every 5 ticks
      this.saveTickCount++;
      if (this.saveTickCount % 5 === 0) {
        const state = this.loadState(assignmentId);
        if (state) {
          state.remainingSeconds = next;
          this.saveState(state);
        }
      }

      if (next <= 0) {
        this.handleExpiry();
      }
    }, 1000);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  clearState(assignmentId: string): void {
    localStorage.removeItem(this.KEY_PREFIX + assignmentId);
  }

  /** Format seconds as MM:SS */
  format(seconds: number): string {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  /** 'green' | 'amber' | 'red' */
  colorClass(remaining: number, total: number): string {
    if (total <= 0) return 'green';
    const pct = remaining / total;
    if (pct > 0.25) return 'green';
    if (pct > 0.10) return 'amber';
    return 'red';
  }

  private handleExpiry(): void {
    this.stop();
    this.remainingSeconds.set(0);
    this.expired.set(true);
    if (this.onExpireCallback) this.onExpireCallback();
  }

  private saveState(state: TimerState): void {
    localStorage.setItem(this.KEY_PREFIX + state.assignmentId, JSON.stringify(state));
  }

  private loadState(assignmentId: string): TimerState | null {
    const raw = localStorage.getItem(this.KEY_PREFIX + assignmentId);
    return raw ? JSON.parse(raw) : null;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
