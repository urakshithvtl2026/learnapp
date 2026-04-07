import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExamDataService } from '../../services/exam-data.service';
import { ExamTimerService } from '../../services/exam-timer.service';
import { AuthService } from '../../../services/auth.service';
import {
  AnswerRecord,
  Assignment,
  DraftAnswers,
  ExamResult,
  QuestionForPlayer,
  QuestionPaper,
} from '../../models/exam.model';

@Component({
  selector: 'app-exam-player',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatRadioModule, MatProgressBarModule,
  ],
  templateUrl: './exam-player.component.html',
  styleUrl: './exam-player.component.scss',
})
export class ExamPlayerComponent implements OnInit, OnDestroy {
  private readonly DRAFT_KEY_PREFIX = 'exam_in_progress_';

  assignment: Assignment | null = null;
  paper: QuestionPaper | null   = null;
  questions: QuestionForPlayer[] = [];

  currentIndex = signal(0);
  answers      = signal<DraftAnswers>({});
  startedAt    = '';
  timedOut     = false;
  timeoutWarning = false; // autoSubmit=false path

  loading = true;
  error   = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examData: ExamDataService,
    public timer: ExamTimerService,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();

    const assignmentId = this.route.snapshot.paramMap.get('assignmentId')!;
    this.assignment    = this.examData.assignments().find(a => a.id === assignmentId) ?? null;

    if (!this.assignment) { this.error = 'Assignment not found.'; this.loading = false; return; }
    if (this.assignment.status === 'completed') {
      this.router.navigate(['/exam/my-exams']);
      return;
    }

    this.paper     = this.examData.papers().find(p => p.id === this.assignment!.questionPaperId) ?? null;
    this.questions = this.examData.getQuestionsForPlayer(this.assignment.questionPaperId);

    if (!this.paper || this.questions.length === 0) {
      this.error = 'Paper not found or has no questions.'; this.loading = false; return;
    }

    // Restore draft answers
    const draft = this.loadDraft(assignmentId);
    if (draft) { this.answers.set(draft); }

    // Mark in_progress
    if (this.assignment.status === 'pending') {
      this.startedAt = new Date().toISOString();
      await this.examData.saveAssignment({ ...this.assignment, status: 'in_progress' });
    } else {
      // Restore startedAt from timer state if available
      const timerRaw = localStorage.getItem('exam_timer_' + assignmentId);
      this.startedAt = timerRaw ? JSON.parse(timerRaw).startedAt : new Date().toISOString();
    }

    // Start timer if enabled
    if (this.paper.timer.enabled && this.paper.timer.durationSeconds) {
      this.timer.start(assignmentId, this.paper.timer.durationSeconds, () => {
        if (this.paper!.timer.autoSubmit) {
          this.timedOut = true;
          this.submit(true);
        } else {
          this.timeoutWarning = true;
        }
      });
    }

    this.loading = false;
  }

  ngOnDestroy(): void {
    this.timer.stop();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  get currentQuestion(): QuestionForPlayer | null {
    return this.questions[this.currentIndex()] ?? null;
  }

  get answeredCount(): number {
    return Object.keys(this.answers()).length;
  }

  get allAnswered(): boolean {
    return this.answeredCount === this.questions.length;
  }

  get progress(): number {
    return this.questions.length > 0 ? (this.answeredCount / this.questions.length) * 100 : 0;
  }

  prev(): void {
    if (this.currentIndex() > 0) this.currentIndex.update(i => i - 1);
  }

  next(): void {
    if (this.currentIndex() < this.questions.length - 1) this.currentIndex.update(i => i + 1);
  }

  selectOption(questionId: string, optionId: string): void {
    this.answers.update(a => ({ ...a, [questionId]: optionId }));
    this.saveDraft();
  }

  selectedOption(questionId: string): string {
    return this.answers()[questionId] ?? '';
  }

  isAnswered(questionId: string): boolean {
    return !!this.answers()[questionId];
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  async submit(autoSubmit = false): Promise<void> {
    const paper      = this.paper!;
    const assignment = this.assignment!;
    const submittedAt = new Date().toISOString();
    const timeTakenSeconds = Math.round(
      (new Date(submittedAt).getTime() - new Date(this.startedAt).getTime()) / 1000
    );

    const answerRecords: AnswerRecord[] = paper.questions.map(q => {
      const selected = this.answers()[q.id] ?? '';
      return {
        questionId: q.id,
        selectedOptionId: selected,
        isCorrect: selected === q.correctOptionId,
      };
    });

    const correct = answerRecords.filter(a => a.isCorrect).length;
    const wrong   = answerRecords.length - correct;
    const score   = Math.round((correct / answerRecords.length) * 100);

    const result: ExamResult = {
      id:               this.examData.generateId('res'),
      assignmentId:     assignment.id,
      userId:           assignment.userId,
      questionPaperId:  assignment.questionPaperId,
      startedAt:        this.startedAt,
      submittedAt,
      timeTakenSeconds,
      timedOut:         autoSubmit,
      totalQuestions:   answerRecords.length,
      correct, wrong, score,
      answers:          answerRecords,
    };

    await this.examData.saveResult(result);
    await this.examData.saveAssignment({ ...assignment, status: 'completed' });
    this.timer.clearState(assignment.id);
    this.clearDraft(assignment.id);

    this.router.navigate(['/exam/result', result.id]);
  }

  // ── Timer helpers ─────────────────────────────────────────────────────────

  get timerColor(): string {
    return this.timer.colorClass(this.timer.remainingSeconds(), this.paper?.timer.durationSeconds ?? 0);
  }

  get timerFormatted(): string {
    return this.timer.format(this.timer.remainingSeconds());
  }

  // ── Draft persistence ─────────────────────────────────────────────────────

  private saveDraft(): void {
    localStorage.setItem(
      this.DRAFT_KEY_PREFIX + this.assignment!.id,
      JSON.stringify(this.answers())
    );
  }

  private loadDraft(assignmentId: string): DraftAnswers | null {
    const raw = localStorage.getItem(this.DRAFT_KEY_PREFIX + assignmentId);
    return raw ? JSON.parse(raw) : null;
  }

  private clearDraft(assignmentId: string): void {
    localStorage.removeItem(this.DRAFT_KEY_PREFIX + assignmentId);
  }
}
