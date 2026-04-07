import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamDataService } from '../../services/exam-data.service';
import { Option, Question, QuestionPaper } from '../../models/exam.model';

@Component({
  selector: 'app-paper-editor',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSlideToggleModule,
    MatSelectModule, MatDividerModule,
  ],
  templateUrl: './paper-editor.component.html',
  styleUrl: './paper-editor.component.scss',
})
export class PaperEditorComponent implements OnInit {
  isNew = false;
  paper: QuestionPaper = this.emptyPaper();
  timerMinutes = 10;

  // Editing state for a single question
  editingQuestion: Question | null = null;
  editingIdx = -1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examData: ExamDataService,
    private snack: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNew = true;
      this.paper = this.emptyPaper();
    } else {
      const found = this.examData.papers().find(p => p.id === id);
      if (found) {
        this.paper = JSON.parse(JSON.stringify(found)); // deep copy
        this.timerMinutes = Math.floor((this.paper.timer.durationSeconds ?? 600) / 60);
      } else {
        this.snack.open('Paper not found.', 'OK', { duration: 3000 });
        this.router.navigate(['/exam/admin/papers']);
      }
    }
  }

  // ── Timer ──────────────────────────────────────────────────────────────────

  onTimerToggle(enabled: boolean): void {
    this.paper.timer.enabled = enabled;
    if (enabled && !this.paper.timer.durationSeconds) {
      this.paper.timer.durationSeconds = this.timerMinutes * 60;
    }
  }

  onMinutesChange(): void {
    this.paper.timer.durationSeconds = this.timerMinutes * 60;
  }

  // ── Questions ──────────────────────────────────────────────────────────────

  addQuestion(): void {
    this.editingQuestion = this.emptyQuestion();
    this.editingIdx = -1;
  }

  editQuestion(q: Question, idx: number): void {
    this.editingQuestion = JSON.parse(JSON.stringify(q));
    this.editingIdx = idx;
  }

  saveQuestion(): void {
    if (!this.editingQuestion) return;
    const q = this.editingQuestion;
    if (!q.text.trim()) { this.snack.open('Question text is required.', 'OK', { duration: 2000 }); return; }
    if (!q.correctOptionId) { this.snack.open('Select the correct option.', 'OK', { duration: 2000 }); return; }

    if (this.editingIdx >= 0) {
      this.paper.questions[this.editingIdx] = q;
    } else {
      q.id = this.examData.generateId('q');
      this.paper.questions.push(q);
    }
    this.editingQuestion = null;
    this.editingIdx = -1;
  }

  cancelQuestion(): void {
    this.editingQuestion = null;
    this.editingIdx = -1;
  }

  deleteQuestion(idx: number): void {
    this.paper.questions.splice(idx, 1);
  }

  // ── Save paper ─────────────────────────────────────────────────────────────

  async save(): Promise<void> {
    if (!this.paper.title.trim()) {
      this.snack.open('Title is required.', 'OK', { duration: 2000 });
      return;
    }
    if (this.paper.questions.length < 1) {
      this.snack.open('Add at least one question.', 'OK', { duration: 2000 });
      return;
    }
    if (this.isNew) {
      this.paper.id        = this.examData.generateId('qp');
      this.paper.createdAt = new Date().toISOString();
    }
    if (this.paper.timer.enabled) {
      this.paper.timer.durationSeconds = this.timerMinutes * 60;
    } else {
      this.paper.timer.durationSeconds = null;
    }
    await this.examData.savePaper(this.paper);
    this.snack.open('Paper saved!', 'OK', { duration: 2000 });
    this.router.navigate(['/exam/admin/papers']);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private emptyPaper(): QuestionPaper {
    return {
      id: '', title: '', description: '',
      createdAt: '',
      timer: { enabled: false, durationSeconds: null, autoSubmit: false },
      questions: [],
    };
  }

  private emptyQuestion(): Question {
    return {
      id: '', text: '',
      options: [
        { id: 'a', text: '' },
        { id: 'b', text: '' },
        { id: 'c', text: '' },
        { id: 'd', text: '' },
      ],
      correctOptionId: '',
    };
  }

  optionLabel(id: string): string {
    return id.toUpperCase();
  }

  trackByIdx(_: number, item: Option): string { return item.id; }
}
